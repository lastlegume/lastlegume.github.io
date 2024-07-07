
const oneCopyHist = document.getElementById("oneCopyHist");
document.onmousemove = function (e) { updateMouseCoords(e); };
document.onmousedown = function (e) { updateHighlightedCol(); };
const tableSelect = document.getElementById("tableSelect");
const csvTable = document.getElementById("csvTable");
const verifyTable = document.getElementById("verifyTable");
let width = document.getElementById("main_content").getBoundingClientRect().width;
let height = window.innerHeight;
tableSelect.addEventListener("change", fillTable);
document.getElementById("verifyButton").addEventListener("click", verifyData);

let mousePos = [0, 0];
const binNumbers = [7]
const coords = { x: 0, y: 0, w: oneCopyHist.width, h: oneCopyHist.height, padding: 40 };
let result = 0;
let reps = 1000000;
//decreases load time temporarily
reps = 1000;
let highlightIdx = -1;
result = simulateNSetups(2, 9, reps, true);
//result = simulateNHands(4,4, 1000000,false)[1];
//console.log(result);
let files = [];
fetch("/assets/blog/prizeprobs/names.txt").then((val) => val.text().then((txt) => { files = txt.replaceAll("\r", "").split("\n"); fillTableSelect() }));
//if basics = 0, ignore the check for if a basic is in hand
function frame(t) {
    highlightIdx = Math.floor((mousePos[0][0] - coords.padding) / Math.floor((coords.w - coords.padding * 2) / binNumbers[0]));
    // if(highlightIdx>=0&&highlightIdx<result.length)
    //     drawProbabilityText(oneCopyHist, result[highlightIdx], reps, highlightIdx)
    hist(oneCopyHist, { "binQuantities": result }, binNumbers[0], { "xRange": [0, 7], "title": "Number Prized With N Copies", "xlab": "Number Prized", "color": "#30A0FF", "coords": coords, "highlight": highlightIdx, "highlightCol": "#FFFF00" });
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
        freqs[0][tempDeck.slice(0, 7).map((val) => (val === "B") ? 1 : 0).reduce((prev, cur) => prev + cur)]++;
        freqs[1][tempDeck.slice(0, 7).map((val) => (val === "C") ? 1 : 0).reduce((prev, cur) => prev + cur)]++;

    }
    // console.log((deck))
    // console.log(deck.slice(0,7))
    // console.log(deck.map((val)=>(val==="C")?1:0).reduce((prev, cur)=>prev+cur))
    //console.log(freqs);
    //console.log(mulligans);
    return freqs;
    //console.log(freqs[1]/n);
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
            td.innerText = (!parseFloat(csv[r][c])) ? csv[r][c].replaceAll('"', '') : parseFloat(csv[r][c]).toPrecision(5);
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
        opt.innerText = path[1].replace(".csv", "");
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
}

function updateHighlightedCol() {
    console.log(highlightIdx);
}

// // struggles with mobile phones so not being used
// function drawProbabilityText(canvas, trials, total, number){
//     let ctx = canvas.getContext('2d');
//     ctx.clearRect(canvas.width-250, 0,250,canvas.height);
//     ctx.font = "12px 'Trebuchet MS'";
//     ctx.fillStyle = "#FFFFFF";
//     ctx.textAlign = "left";

//     ctx.fillText(`${trials} or ${trials/total}`, canvas.width-240, 100, 230);
//     ctx.fillText(`trials out of`, canvas.width-240, 120, 230);
//     ctx.fillText(`${total}`, canvas.width-240, 140, 230);
//     ctx.fillText(`had`, canvas.width-240, 160, 230);
//     ctx.fillText(`${number}`, canvas.width-240, 180, 230);
//     ctx.fillText(`prized`, canvas.width-240, 200, 230);

// }

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
            //            console.info(copies+" "+basics+" "+path)
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
        // console.log(`rgb(${Math.min(error, .5) * 510}, ${Math.max(0, .5 - error) * 510}, 0)`);
        currentTrow.appendChild(ctd);
    }
}

