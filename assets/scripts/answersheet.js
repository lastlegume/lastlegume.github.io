const inputArea = document.getElementById('input');
const convert = document.getElementById('convert');
convert.addEventListener('click', () => convertText());
const outputArea = document.getElementById('output');
var FIBThreshold = 25;
var mcqBlanks = false;
var includeAll = false;
var showAnswerChoices = false;
function convertText() {
    let input = inputArea.value.split("\n");
 //   console.log(input);
    let output = "";
    for (let i = 0; i < input.length; i++) {
        if (input[i].includes("\\question")&&input[i].trim().substring(0,9)==="\\question") {
            output += input[i].match(/\\question(\[[\d]*\])?/g) + " ";
            if(i<input.length-1){
                // short answer/fib
                input[i+1] = input[i+1].trim();
                if(input[i+1].trim().substring(0,1)==="%"){
                    if(input[i+1].length>FIBThreshold){
                        output+="\\hspace{.1em}\n\\begin{solutionbox}{"+Math.floor((input[i+1].length)**.5)+"em}\n"+input[i+1].substring(1).trim()+"\n\\end{solutionbox}";
                    }else{
                        output+="\\fillin["+input[i+1].substring(1).trim()+"][.85\\textwidth]";
                    }
                    i++;
                // MCQ
                } else if (input[i+1].includes("\\begin{")&&(input[i+1].includes("choices")||input[i+1].includes("checkboxes"))){
                    if(mcqBlanks){

                    }else{
                        let environment = input[i+1].matchAll(/\\begin{(.*?)}/gi);
                    environment = [...environment][0][1];
                    
                    let end = i+2;
                    for(let j = i+1;j<input.length&&!input[j].includes("\\end{"+environment+"}");j++){
                        if(input[j].includes("choice")&&!input[j].includes("\\begin{")&&!input[j].includes("\\end{")&&!showAnswerChoices){
                            let o = input[j].matchAll(/\\(correct)?choice/gi);
                            o = [...o][0][0];
                            output += o+"\n";
                        }else
                            output += input[j]+"\n";
                        end = j;
                    }
                    output += input[end+1];
                    i = end;
                    }
                    
                } else{
                    let end = i+1;
                    for(let j = i+1;j<input.length&&input[j].trim().substring(0,1)!=="%";j++){
                        end = j;
                    }
                    end++;
                    if(input[end].length>FIBThreshold){
                        output+="\\hspace{.1em}\n\\begin{solutionbox}{"+Math.floor((input[end].length)**.5)+"em}\n"+input[end].substring(1).trim()+"\n\\end{solutionbox}";
                    }else{
                        output+="\\fillin["+input[end].substring(1).trim()+"][.9\\textwidth]";
                    }
                    i = end;

                }
            }
            output+="\n";
        } else if(includeAll){
            output+=input[i]+"\n";
        }
        if((input[i].toLowerCase().includes("\\section")||input[i].toLowerCase().includes("\\addtocounter"))&&!includeAll){
            output+=input[i]+"\n";
        }
    }
    outputArea.value = output;
    copyText()
}

function copyText() {
    navigator.clipboard.writeText(outputArea.value);
    alert("Copied the text");
} 
