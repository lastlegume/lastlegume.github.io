const oneCopyHist = document.getElementById("oneCopyHist");
const simHist = document.getElementById("simHist");

document.onmousemove = function (e) { updateMouseCoords(e); };
const tableSelect = document.getElementById("tableSelect");
const csvTable = document.getElementById("csvTable");
const verifyTable = document.getElementById("verifyTable");
let width = document.getElementById("main_content").getBoundingClientRect().width;

tableSelect.addEventListener("change", fillTable);
document.getElementById("verifyButton").addEventListener("click", verifyData);
document.getElementById("simOneCopyButton").addEventListener("click", simOneCopy);
document.getElementById("simButton").addEventListener("click", simulate);

const oneCopyReps = document.getElementById("simOneCopyReps");
const simSettings = document.getElementsByClassName("fullSim");
let prevSettings = [simSettings[0].value*1, simSettings[1].value*1, simSettings[2].value*1, simSettings[3].value, simSettings[4].checked];
let mousePos = [[], []];
let means = [0,0];
let prevReps = [oneCopyReps.value, simSettings[0].value];
const binNumbers = [7,7]
let coords = [{ x: 0, y: 0, w: oneCopyHist.width, h: oneCopyHist.height, padding: 40 }, { x: 0, y: 0, w: simHist.width, h: simHist.height, padding: 40 }];
let runSummarySidebar = [true, true];
let results = [0,0];
let reps = 1000000;
//decreases load time temporarily
reps = 1000;
let highlightIdx = [-1, -1];
results[0] = simulateNSetups(1, 0, oneCopyReps.value, false);
results[1] = simulateNSetups(prevSettings[1]*1, prevSettings[2]*1, prevSettings[0], prevSettings[4]);
means[0] = meanFromBins(results[0]);
means[1] = meanFromBins(results[1]);

//results[0] = simulateNHands(4,4, 1000000,false)[1];
adjustWidth();

let files = [];
fetch("/assets/blog/prizeprobs/names.txt").then((val) => val.text().then((txt) => { files = txt.replaceAll("\r", "").split("\n"); fillTableSelect() }));
//if basics = 0, ignore the check for if a basic is in hand
function frame(t) {
    highlightIdx[0] = Math.floor((mousePos[0][0] - coords[0].padding) / Math.floor((coords[0].w - coords[0].padding * 2) / binNumbers[0]));
    highlightIdx[1] = Math.floor((mousePos[1][0] - coords[1].padding) / Math.floor((coords[1].w - coords[1].padding * 2) / ((prevSettings[3]!=="normal")?8:7)));

    if(runSummarySidebar[0]&&highlightIdx[0]>=0&&highlightIdx[0]<results[0].length)
        drawProbabilityText(oneCopyHist, results[0][highlightIdx[0]], prevReps[0], highlightIdx[0])
    if(runSummarySidebar[1]&&highlightIdx[1]>=0&&highlightIdx[1]<results[1].length)
        drawProbabilityText(simHist, results[1][highlightIdx[1]], prevReps[1], highlightIdx[1])
    hist(oneCopyHist, { "binQuantities": results[0] }, binNumbers[0], { "xRange": [0, 7], "title": "Number Prized With 1 Copy", "xlab": "Number Prized", "color": "#30A0FF", "coords": coords[0], "highlight": highlightIdx[0], "highlightCol": "#FFFF00", "mean":means[0]});
    hist(simHist, { "binQuantities": results[1] }, ((prevSettings[3]!=="normal")?8:7), { "xRange": [0, ((prevSettings[3]!=="normal")?8:7)], "title": ((prevSettings[3]==="binhand")?"Basics ":"Number ")+((prevSettings[3]!=="normal")?"In Hand":"Prized")+(width>450?` With ${prevSettings[1]} Copies and ${prevSettings[2]} Basics`:""), "xlab": "Number "+((prevSettings[3]!=="normal")?"In Hand":"Prized"), "color": "#30A0FF", "coords": coords[1], "highlight": highlightIdx[1], "highlightCol": "#FFFF00", "mean":means[1] });

    window.requestAnimationFrame(frame)


}
window.requestAnimationFrame(frame)

function simulateNSetups(copies, basics, n, isCardBasic) {
    let deck = createDeck(copies, basics);//-(copies*isCardBasic?1:0)
    let freqs = Array(7).fill(0);
    let mulligans = 0;
    for (let i = 0; i < n; i++) {
        let tempDeck = shuffle(deck);
        while ((basics != 0 || isCardBasic) && !(tempDeck.slice(0, 7).includes("B") || (tempDeck.slice(0, 7).includes("C") && isCardBasic))) {
            tempDeck = shuffle(deck);
            mulligans++;
        }
        freqs[tempDeck.slice(7, 13).map((val) => (val === "C") ? 1 : 0).reduce((prev, cur) => prev + cur)]++;
    }
    // console.log((deck))
    // console.log(deck.slice(0,7))
    // console.log(deck.map((val)=>(val==="C")?1:0).reduce((prev, cur)=>prev+cur))
    //console.log(freqs);
    //console.log(mulligans);
    return freqs;
    //console.log(freqs[1]/n);
}
function simulateNHands(copies, basics, n, isCardBasic) {
    let deck = createDeck(copies, basics);//-(copies*isCardBasic?1:0)
    let freqs = [Array(8).fill(0), Array(Math.min(copies + 1, 8)).fill(0)];
    let mulligans = 0;
    for (let i = 0; i < n; i++) {
        let tempDeck = shuffle(deck);
        while ((basics != 0 || isCardBasic) && !(tempDeck.slice(0, 7).includes("B") || (tempDeck.slice(0, 7).includes("C") && isCardBasic))) {
            tempDeck = shuffle(deck);
            mulligans++;
        }
        freqs[0][tempDeck.slice(0, 7).map((val) => (val === "B"||val === "C") ? 1 : 0).reduce((prev, cur) => prev + cur)]++;
        freqs[1][tempDeck.slice(0, 7).map((val) => (val === "C") ? 1 : 0).reduce((prev, cur) => prev + cur)]++;

    }
    //0 is basics, 1 is prizes
    return freqs;
}
function createDeck(copies, basics) {
    return [...Array(60 - copies - basics).fill('0'), ...Array(copies).fill('C'), ...Array(basics).fill('B')];
}
function slowShuffle(deck) {
    return deck.map((val) => ({ val, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ val }) => (val))
}
function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}
async function fillTable() {
    csvTable.innerHTML = "";
    let choice = tableSelect.value;
    let head = document.createElement("thead");
    //head.innerText = choice;
    let body = document.createElement("tbody");
    let response = await fetch("/assets/blog/prizeprobs/" + choice);
    response = await response.text();
    let csv = readCSV(response);
    let row = document.createElement("tr");
    for (let i = 0; i < csv[0].length-1; i++) {
        let td = document.createElement("th");
        td.innerText = csv[0][i].replaceAll('"', '');
        td.classList.add("x-small");
        row.appendChild(td);

    }
    head.appendChild(row);
    for (let r = 1; r < csv.length; r++) {
        row = document.createElement("tr");
        for (let c = 0; c < csv[r].length; c++) {
            let td = document.createElement("td");
            td.innerText = (!parseFloat(csv[r][c])) ? csv[r][c].replaceAll('"', '') : (width>=800?parseFloat(csv[r][c]).toPrecision(5):(width<400?parseFloat(csv[r][c]).toFixed(3):parseFloat(csv[r][c]).toFixed(5)));
            td.classList.add("x-small");
            row.appendChild(td);
        }
        body.appendChild(row);
    }
    csvTable.appendChild(head);
    csvTable.appendChild(body);

}
function fillTableSelect() {
    let ignoreBasics = document.createElement("optgroup");
    ignoreBasics.id = "ignoreBasics";
    ignoreBasics.label = "Ignore Basics";
    tableSelect.appendChild(ignoreBasics);

    let notBasic = document.createElement("optgroup");
    notBasic.id = "notBasic";
    notBasic.label = "Target card is not a basic";
    tableSelect.appendChild(notBasic);

    let isBasic = document.createElement("optgroup");
    isBasic.label = "Target card is a basic";
    isBasic.id = "isBasic";
    tableSelect.appendChild(isBasic);

    for (let i = 1; i < files.length; i++) {
        let opt = document.createElement("option");
        path = files[i].split("/");
        let name = "";
        if(files[i].includes("handProbabilities"))
            name+="Probability of being in hand"+((files[i].includes("NoBasics"))?" (ignoring basics)":": ");
        else if(files[i].includes("prizeProbabilities"))
            name+="Probability of being in prizes"+((files[i].includes("NoBasics"))?" (ignoring basics)":": ");
        let matches = files[i].match(/(B?)_([\d]+?)Basics/);
        if(matches){
            if(matches[1]==="B")
                name+=matches[2]+" other basic(s)"
            else
                name+=matches[2]+" basic(s)"
    
        }
        opt.innerText = name;

        opt.value = files[i];
        opt.classList.add("x-small");
        if (path[0] === "ignoreBasics") {
            ignoreBasics.appendChild(opt);
        } else if (path[0] === "notBasic") {
            notBasic.appendChild(opt);
        } else if (path[0] === "isBasic") {
            isBasic.appendChild(opt);
        }
    }
}
function readCSV(text) {
    csv = text.split("\n");
    csv.pop(csv.length - 1);
    for (let i = 0; i < csv.length; i++) {
        var string = csv[i].replaceAll("\r", "");
        if (string.substring(string.length - 1) === ",")
            string = string.substring(0, string.length - 1);
        csv[i] = [];
        var start = 0;
        for (let j = 0; j < string.length; j++) {
            if (string.substring(j, j + 1) === ",") {
                csv[i].push(string.substring(start, j));
                start = j + 1;
                while (string.substring(j + 1, j + 2) === "\"") {
                    start = j + 2;
                    j += 2;
                    while (j < string.length && (string.substring(j, j + 1) !== "\"" || string.substring(j + 1, j + 2) !== ","))
                        j++;
                    j++;
                    csv[i].push(string.substring(start, j - 1).replaceAll('"', ''));
                    start = j + 1;
                }
            }
        }
        csv[i].push(string.substring(start));
    }

    //console.log(csv);
    return csv;
}

function updateMouseCoords(e) {
    let rect = oneCopyHist.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    mousePos[0] = [x, y];
    rect = simHist.getBoundingClientRect();
    mousePos[1] = [e.clientX - rect.left, e.clientY - rect.top];
}


function drawProbabilityText(canvas, trials, total, number){
    let ctx = canvas.getContext('2d');
    ctx.clearRect(canvas.width-220, 0,220,canvas.height);
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "left";
    ctx.font = "28px 'Trebuchet MS'";

    ctx.fillText(`${(trials>1000000)?trials.toPrecision(4):trials}`, canvas.width-220, 40, 230);
    ctx.fillText(`${((trials/total)*100).toPrecision(5)}%`, canvas.width-220, 100, 230);


    ctx.font = "12px 'Trebuchet MS'";
    ctx.fillText(`or`, canvas.width-220, 60, 230);

    ctx.fillText(`trials out of`, canvas.width-220, 120, 230);
    ctx.fillText(`${total}`, canvas.width-220, 140, 230);
    ctx.fillText(`had`, canvas.width-220, 160, 230);
    ctx.fillText(`${number} copies`, canvas.width-220, 180, 230);
    ctx.fillText(`prized`, canvas.width-220, 200, 230);


}

async function verifyData() {
    // we need to do reps trials ~240*60 times
    verifyTable.innerHTML = "";
    reps = document.getElementById('verifyReps').value;
    
    let currentTrow = document.createElement("tr");
    let verifyIdx = 0;
    let body = document.createElement("tbody");
    verifyTable.appendChild(body);
    for (let i = 1; i < files.length; i++) {
        let path = files[i];
        let response = await fetch("/assets/blog/prizeprobs/" + path);
        response = await response.text();
        let csv = readCSV(response);
        let error = 0;
        let n = 0;
        for (let r = 1; r < csv.length; r++) {
            let sim = [];
            let copies = csv[r][0].match(/[\d]+/g)[0] * 1;
            let basics = (path.includes("NoBasics")) ? 0 : path.match(/_([\d]+)Basics/)[1] * 1;
            if (path.includes("handProb")) {
                sim = simulateNHands(copies, basics, reps, path.includes("B_"))[1];
            } else {
                sim = simulateNSetups(copies, basics, reps, path.includes("B_"));
            }
            sim = sim.map((e) => e / reps);
            for (let c = 0; c < sim.length; c++) {
                error += Math.abs(sim[c] - csv[r][c + 1]);
                n++;
            }
        }
        verifyIdx++;
        if (verifyIdx % Math.floor(width/75) == 1) {
            currentTrow = document.createElement("tr");
            body.appendChild(currentTrow);
        }
        let ctd = document.createElement("td");
        error/=n;
        ctd.title = path.split("/")[1];
        ctd.innerText = error.toPrecision(5);
        error = Math.min(error * 25, 1);
        ctd.style.backgroundColor = `rgb(${Math.min(error, .5) * 510}, ${Math.max(0, .5 - error) * 510}, 0)`;
        ctd.classList.add("xx-small");
        currentTrow.appendChild(ctd);
    }
}

function simOneCopy(){
    results[0] = simulateNSetups(1, 0, oneCopyReps.value, false);
    prevReps[0] = oneCopyReps.value;
    means[0] = meanFromBins(results[0]);

}
function simulate(){
    prevSettings = [simSettings[0].value*1, simSettings[1].value*1, simSettings[2].value*1, simSettings[3].value, simSettings[4].checked];
    if(prevSettings[1]>60){
        simSettings[1].value = 5;  
        prevSettings[1] = 5;
    }
    if(prevSettings[1]+prevSettings[2]>60){
        simSettings[2].value = 0;
        prevSettings[2] = 0;
    }
    if(prevSettings[3]==="binhand")
        results[1] = simulateNHands(prevSettings[1]*1, prevSettings[2]*1, prevSettings[0], prevSettings[4])[0];
    else if(prevSettings[3]==="tinhand")
        results[1] = simulateNHands(prevSettings[1]*1, prevSettings[2]*1, prevSettings[0], prevSettings[4])[1];
    else
        results[1] = simulateNSetups(prevSettings[1]*1, prevSettings[2]*1, prevSettings[0], prevSettings[4]);
    prevReps[1] = prevSettings[0];
    means[1] = meanFromBins(results[1]);
}

function adjustWidth(){
    width = document.getElementById("main_content").getBoundingClientRect().width;
    let height = window.innerHeight;
    oneCopyHist.width = width;
    oneCopyHist.height = height*.7;
    simHist.height = height*.7;

    if(width>900){
        simHist.width=width-300;
        coords[1] = { x: 0, y: 0, w: width-520, h: simHist.height, padding: 40 };
    }
    else if(width>600){
        simHist.width=width;
        coords[1] = { x: 0, y: 0, w: width-220, h: simHist.height, padding: 40 };
    }else{
        simHist.width=width;
        coords[1] = { x: 0, y: 0, w: width, h: simHist.height, padding: 40 };
        runSummarySidebar[1] = false;

    }
    if(width>700){
        coords[0] = { x: 0, y: 0, w: width-220, h: oneCopyHist.height, padding: 40 };
    }else{
        coords[0] = { x: 0, y: 0, w: width, h: oneCopyHist.height, padding: 40 };
        runSummarySidebar[0] = false;

    }
    
}
function meanFromBins(list){
    let sum = 0;
    let total = 0;
    for(let i = 0;i<list.length;i++){
        sum+=i*list[i];
        total+=list[i];
    }
    return sum/total;
}