const inputArea = document.getElementById('input');
const convert = document.getElementById('convert');
convert.addEventListener('click', () => convertText());
const outputArea = document.getElementById('output');
var FIBThreshold = 25;
const mcq = document.getElementById("mcq");
const frqtype = document.getElementById("frqtype");
const autoCalcSASize = document.getElementById("autoCalcSASize");
const linegoal = document.getElementById("linegoal");

mcq.addEventListener('change', () => updateBoxes());
frqtype.addEventListener('change', () => updateBoxes());
autoCalcSASize.addEventListener('change', () => updateBoxes());
linegoal.addEventListener('change', () => updateBoxes());


updateBoxes();
const markerInput = document.getElementById("marker");
let marker = "%";
let includeAll = false;
let includeSection = true;
let showAnswerChoices = false;
function convertText() {
    let input = inputArea.value.split("\n");
    //   console.log(input);
    let output = "";
    let maxNumAnswers = 0;
    let consecutiveMCQ = 0;
    marker = markerInput.value;
    includeAll = document.getElementById("includeAll").checked;
    includeSection = document.getElementById("includeSection").checked;
    includeParts = document.getElementById("includeParts").checked;
    includeFullwidth = document.getElementById("includeFullwidth").checked;

    showAnswerChoices = document.getElementById("showAnswerChoices").checked;
    FIBThreshold = document.getElementById("FIBThreshold").value;

    for (let i = 0; i < input.length; i++) {
        if (/\\(sub)*?(part|question)\[(\d*?)(\\half)\]/g.test(input[i])) {
            let question = "";
            question += input[i].match(/\\(sub)*?(part|question)\[(\d*?)(\\half)*?\]/g) + " ";
            if (i < input.length - 1) {
                // short answer/fib
                input[i + 1] = input[i + 1].trim();
                if (input[i + 1].trim().substring(0, marker.length) === marker) {
                    if(consecutiveMCQ>0){
                        output+="\\end{multicols}\n";
                    }
                    consecutiveMCQ = 0;

                    if ((input[i + 1].trim().length > FIBThreshold&&frqtype.value!=="forceFIB")||frqtype.value.includes("solution")) {
                        if(frqtype.value==="default")
                            question += "\\hspace{.1em}\n\\begin{solutionbox}{" + ((autoCalcSASize.checked)?2+Math.floor((input[i + 1].length) ** .5):document.getElementById("SAsize").value) + "em}\n" + input[i + 1].trim().substring(marker.length).trim() + "\n\\end{solutionbox}";
                        else
                            question += `\\hspace{.1em}\n\\begin{${frqtype.value.substring(5)}}${frqtype==="forcesolutionbox"?"{":"["}${(autoCalcSASize.checked)?2+Math.floor((input[i + 1].length) ** .5):document.getElementById("SAsize").value}em${frqtype==="forcesolutionbox"?"}":"]"}\n${input[i + 1].trim().substring(marker.length).trim()}\n\\end{${frqtype.value.substring(5)}}`;
                    } else {
                        question += "\\fillin[" + input[i + 1].trim().substring(marker.length).trim() + "]["+document.getElementById("FIBsize").value+"]";
                    }
                    i++;
                    // MCQ
                } else if (input[i + 1].includes("\\begin{") && (input[i + 1].includes("choices") || input[i + 1].includes("checkboxes"))) {
                    if(mcq.value==="multiblanks")
                        consecutiveMCQ++;
                    if(consecutiveMCQ==1){
                        output+="\\begin{multicols}{$#multicolnumber#$}\n";
                    }
                    let environment = input[i + 1].matchAll(/\\begin{(.*?)}/gi);
                    environment = [...environment][0][1];
                    if (mcq.value.includes("blanks")) {
                        //mcq blanks
                        let correctIndeces = [];
                        for (let j = i + 1; j < input.length && !input[j].includes("\\end{" + environment + "}"); j++) {
                            if (input[j].includes("choice") && !input[j].includes("\\begin{") && !input[j].includes("\\end{")) {
                                if (input[j].includes("\\correct"))
                                    correctIndeces.push(j - i - 2);
                                end = j;
                            }
                        }
                        i = end+1;

                        maxNumAnswers = Math.max(maxNumAnswers, correctIndeces.length);
                        question += `\\fillin[${correctIndeces.map(function (x) { return String.fromCharCode(65 + x) }).join("")}][$#mcqblanklength#$]`;

                    } else {
                        //mcq letters
                        if (mcq.value === "forcenormal")
                            environment = environment.replaceAll("onepar", "");
                        else if (mcq.value === "forceonepar" && !environment.includes("onepar"))
                            environment = "onepar" + environment;
                        if (environment.includes("onepar"))
                            question += "\\hspace{.1em}";
                        let end = i + 2;

                        for (let j = i + 1; j < input.length && !input[j].includes("\\end{" + environment + "}"); j++) {
                            if (input[j].includes("choice") && !input[j].includes("\\begin{") && !input[j].includes("\\end{")) {
                                let o = "";
                                if(!showAnswerChoices){
                                    o = input[j].matchAll(/\\(correct)?choice/gi);
                                    o = [...o][0][0];
                                }else
                                    o = input[j];
                                

                                question += o + "\n";
                            } else
                            question += input[j] + "\n";
                            end = j;
                        }
                        question += input[end + 1];
                        i = end;
                    }

                } else {
                    if(consecutiveMCQ>0){
                        output+="\\end{multicols}\n";
                    }
                    consecutiveMCQ = 0;
                    let end = i + 1;
                    for (let j = i + 1; j < input.length && input[j].trim().substring(0, marker.length) !== marker; j++) {
                        end = j;
                    }
                    end++;
                    if ((input[i + 1].length > FIBThreshold&&frqtype.value!=="forceFIB")||frqtype.value.includes("solution")) {
                        if(frqtype.value==="default")
                            question += "\\hspace{.1em}\n\\begin{solutionbox}{" + (autoCalcSASize.checked)?2+Math.floor((input[i + 1].length) ** .5):document.getElementById("SAsize").value + "em}\n" + input[i + 1].trim().substring(marker.length).trim() + "\n\\end{solutionbox}";
                        else
                            question += `\\hspace{.1em}\n\\begin{${frqtype.value.substring(5)}}${frqtype==="forcesolutionbox"?"{":"["}${(autoCalcSASize.checked)?2+Math.floor((input[i + 1].length) ** .5):document.getElementById("SAsize").value}em${frqtype==="forcesolutionbox"?"}":"]"}\n${input[i + 1].trim().substring(marker.length).trim()}\n\\end{${frqtype.value.substring(5)}}`;
                    } else {
                        question += "\\fillin[" + input[i + 1].trim().substring(marker.length).trim() + "]["+document.getElementById("FIBsize").value+"]";
                    }
                    i = end;

                }
            }
            output+=question;
            output += "\n";
            //lines that are not questions
        } else {
            
            if (includeAll || input[i].toLowerCase().includes("\\addtocounter")) {
                if(consecutiveMCQ>0){
                    output+="\\end{multicols}\n";
                }
                consecutiveMCQ = 0;
                output += input[i] + "\n";
            }   else if ((/\\(sub)*?section/g.test(input[i].toLowerCase())) && includeSection) {
                if(consecutiveMCQ>0){
                    output+="\\end{multicols}\n";
                }
                consecutiveMCQ = 0;
                output += input[i] + "\n";
            }   else if ((/\\(begin|end){(sub)*?parts}/g.test(input[i].toLowerCase())) && includeParts) {
                if(consecutiveMCQ>0){
                    output+="\\end{multicols}\n";
                }
                consecutiveMCQ = 0;
                output += input[i] + "\n";
            }   else if ((/^\\(fullwidth{|textbf{|noindent )/g.test(input[i].toLowerCase().trim())) && includeFullwidth) {
                if(consecutiveMCQ>0){
                    output+="\\end{multicols}\n";
                }
                consecutiveMCQ = 0;
                output += input[i] + "\n";
            }
        }
        
    }
    if(mcq.value==="longblanks")
        output = output.replaceAll("$#mcqblanklength#$", ".85\\textwidth");
    else if(mcq.value==="shortblanks"||mcq.value==="multiblanks"){
        output = output.replaceAll("$#mcqblanklength#$", `${maxNumAnswers*2+1}em`);
        if(mcq.value==="multiblanks"){
            output = output.replaceAll("$#multicolnumber#$", `${5-Math.ceil(maxNumAnswers/3)}`);
        }
    }
    if(linegoal.checked){
        output = output.replaceAll(".9\\textwidth", `\\the{\\linegoal}`);
        output = "%Don't forget to include the linegoal package (\\usepackage{linegoal}) in the preamble of the document!\n"+output;
    }
    console.log(frqtype.value)
    outputArea.value = output;
    copyText();
}

function copyText() {
    navigator.clipboard.writeText(outputArea.value);
    alert("Output copied to clipboard");
} 
function updateBoxes(){
    document.getElementById("showAnswerChoicesLabel").style.display = (mcq.value.includes("blanks"))?"none":"inline";  
    document.getElementById("FIBThresholdLabel").style.display = (frqtype.value!=="default")?"none":"inline";  
    document.getElementById("FIBsizeLabel").style.display = (frqtype.value==="default"||frqtype.value.includes("FIB"))?"inline":"none";  
    document.getElementById("autoCalcSASizeLabel").style.display = (frqtype.value.includes("FIB"))?"none":"inline";  
    document.getElementById("SAsizeLabel").style.display = (autoCalcSASize.checked||frqtype.value.includes("FIB"))?"none":"inline";  
    document.getElementById("FIBsize").value = (linegoal.checked)?"\\the{\\linegoal}":".85\\textwidth";
}
