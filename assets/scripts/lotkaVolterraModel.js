const timeGraph = document.getElementById("timeGraph");
const slopeGraph = document.getElementById("slopeGraph");
const allGraph = document.getElementById("allGraph");

const graphWorker = new Worker("/assets/workers/lvWorker.js");
graphWorker.addEventListener("message", (m) => processMessage(m));

//settings
const stepButton = document.getElementById("step");
const playButton = document.getElementById("play");
const resetButton = document.getElementById("reset");
const graphAllButton = document.getElementById("graph-all");
const downloadButton = document.getElementById("download");

const stepSizeInput = document.getElementById("step-size");
const stepScaleCheckbox = document.getElementById("step-scaling");
const refreshRateInput = document.getElementById("refresh-rate");
const methodSelect = document.getElementById("method");
const preyGrowth = document.getElementsByClassName("prey-growth");
const predatorResponse = document.getElementsByClassName("predator-func-response");

stepButton.addEventListener('click', preStep);
playButton.addEventListener('click', toggle);
resetButton.addEventListener('click', reset);
graphAllButton.addEventListener('click', function () {
    graphWorker.postMessage(["send all", "graph"]);
});
downloadButton.addEventListener('click', function () {
    graphWorker.postMessage(["send all", "download"]);
});

for (let i = 0; i < preyGrowth.length; i++) {
    preyGrowth[i].addEventListener('change', updateVals);
}
for (let i = 0; i < predatorResponse.length; i++) {
    predatorResponse[i].addEventListener('change', updateVals);
}
stepScaleCheckbox.addEventListener('change', updateVals);

//parameters
const labs = document.getElementsByClassName("var-lab");

const rSlider = document.getElementById("r");
const rValue = document.getElementById("r-value");
const N0Slider = document.getElementById("N0");
const N0Value = document.getElementById("N0-value");
const P0Slider = document.getElementById("P0");
const P0Value = document.getElementById("P0-value");
const aSlider = document.getElementById("a");
const aValue = document.getElementById("a-value");
const KSlider = document.getElementById("K");
const KValue = document.getElementById("K-value");
const fSlider = document.getElementById("f");
const fValue = document.getElementById("f-value");
const qSlider = document.getElementById("q");
const qValue = document.getElementById("q-value");
const hSlider = document.getElementById("h");
const hValue = document.getElementById("h-value");

rSlider.addEventListener('change', updateVals);
N0Slider.addEventListener('change', updateVals);
P0Slider.addEventListener('change', updateVals);
qSlider.addEventListener('change', updateVals);
fSlider.addEventListener('change', updateVals);
hSlider.addEventListener('change', updateVals);
aSlider.addEventListener('change', updateVals);
KSlider.addEventListener('change', updateVals);
stepSizeInput.addEventListener('change', updateVals);
refreshRateInput.addEventListener('change', updateNonessential);
methodSelect.addEventListener('change', updateVals);



//js variables 
let populations = [[N0Slider.value * 1], [P0Slider.value * 1]];
//variables is a list of [r, a, f, q, K, h]
let variables = [rSlider.value, aSlider.value, fSlider.value, qSlider.value, KSlider.value, hSlider.value];

let slopes = [[], []];
var eqs = ["", ""]
let eqDisplays = [document.getElementById("prey-eq"), document.getElementById("pred-eq")];
let running = false;
let updated = true;
let currentT = 0;
let refreshCounter = 0;
let colors = ["#00FFA0", "#FFFF00"];

let yBounds = [[0,Math.max(...populations[0], ...populations[1])],[-1,1]];

let stepSize = stepSizeInput.value * 1;
let refreshRate = refreshRateInput.value * 1;
let xInc = 0.1;
let stepReps = 1;
let xlim = [0, 10];
let intID = 0;

updateVals();
updateNonessential();

function updateVals() {
    running = false;
    clearInterval(intID);
    updated = true;
    reset();

    rValue.textContent = "r value: " + rSlider.value;
    aValue.textContent = "a value: " + aSlider.value;
    KValue.textContent = "K value: " + KSlider.value;
    fValue.textContent = "f value: " + fSlider.value;
    qValue.textContent = "q value: " + qSlider.value;
    hValue.textContent = "h value: " + hSlider.value;

    N0Value.innerHTML = "<math><msub><mi>N</mi><mn>0</mn></msub></math> value: " + N0Slider.value;
    P0Value.innerHTML = "<math><msub><mi>P</mi><mn>0</mn></msub></math> value: " + P0Slider.value;

    variables = [rSlider.value, aSlider.value, fSlider.value, qSlider.value, KSlider.value, hSlider.value];

    // eqs is not used for calculations
    eqs = ["", ""]
    eqs[0] = `${(preyGrowth[0].checked) ? "r * N" : (preyGrowth[1].checked ? "r * N * ( 1 - N / K )" : (preyGrowth[2].checked ? "r * ( 1 - N / K )" : ""))} - ${(predatorResponse[0].checked) ? "a * P * N" : (predatorResponse[1].checked ? "a * P * N / ( 1 + a * h * N )" : (predatorResponse[2].checked ? "P * N ^ 2 / ( ( a * h ) ^ -2 + N ^ 2 ) / h" : ""))}`;
    eqs[1] = `${(predatorResponse[0].checked) ? "f * a * P * N" : (predatorResponse[1].checked ? "f * a * P * N / ( 1 + a * h * N )" : (predatorResponse[2].checked ? "f * P * N ^ 2 / ( ( a * h ) ^ -2 + N ^ 2 ) / h" : ""))} - q * P`

    for(e of labs){
        if((eqs[0]+" "+eqs[1]).includes(e.id.substring(0,1)))
            e.classList.remove("hide");
        else
            e.classList.add("hide");
    }
    updateEquationText();

    stepSize = stepSizeInput.value * 1;
    if (!stepScaleCheckbox.checked) {
        stepSizeInput.max = 0.1;
        if (stepSizeInput.value > 0.1)
            stepSizeInput.value = 0.1;
        stepReps = Math.round(0.1 / stepSize);
        xInc = stepReps * stepSize;
    } else {
        xInc = stepSize;
        stepSizeInput.max = 10;
    }
    xlim = [0, xInc * (timeGraph.width - 40)];
    
    drawGraphs();
}
function drawGraphs(){

    graph({ "list": populations }, timeGraph, { "xlab": "Time", "ylab": "Population", "xlim": xlim, "ylim": yBounds[0], "col": colors, "layers": [1,2] });
    graph({ "list": slopes }, slopeGraph, { "xlab": "Time", "ylab": "Growth Rate", "xlim": xlim, "ylim": yBounds[1], "col": colors });


}
function updateNonessential() {
    refreshRate = refreshRateInput.value * 1;
}
function preStep() {
    if (updated) {
        updateWorker();
        updated = false;
    }
    step();
}
function step() {
    graphWorker.postMessage(["step"]);
    if (!running)
        refreshCounter = 0;
}
function toggle() {
    running = !running;
    drawGraphs();
    playButton.innerText = running ? "Stop" : "Start";
    if (running) {
        if (updated) {
            updateWorker();
        }
        intID = setInterval(step, 10);
    }
    else
        clearInterval(intID);
    updated = false;
}


function reset() {
    running = false;
    clearInterval(intID);
    updated = true;
    graphWorker.postMessage(["reset"]);
    playButton.innerText = "Start";
    populations = [[N0Slider.value * 1], [P0Slider.value * 1]];
    slopes = [[], []];
    currentT = 0;
    allGraph.classList.add("hide");
    
    drawGraphs();
    // graph({ "list": populations }, timeGraph, { "xInc": .005, "xlab": "Time", "ylab": "Population", "xlim": xlim, "ylim": [0, Math.max(...populations[0], ...populations[1])], "col": colors });
    // graph({ "list": slopes }, slopeGraph, { "xInc": .005, "xlab": "Time", "ylab": "Population", "xlim": xlim, "ylim": [0, 100], "col": colors });

}

function processMessage(message) {
    if (message.data[0] === "stepped")
        finishStep(message.data.slice(1));
    else if (message.data[0] === "sent all") {
        if (message.data[1] === "graph")
            graphAll(message.data.slice(2));
        else if (message.data[1] === "download")
            download(message.data.slice(2));
    }
}

function finishStep(m) {
    populations[0].push(m[0][0]);
    populations[1].push(m[0][1]);

    slopes[0].push(m[1][0]);
    slopes[1].push(m[1][1]);

    if (populations[0].length > timeGraph.width - 40) {
        populations[0] = populations[0].slice(1);
        populations[1] = populations[1].slice(1);
        slopes[0] = slopes[0].slice(1);
        slopes[1] = slopes[1].slice(1);
        currentT--;
        xlim = xlim.map((e) => e + xInc);
    }
    yBounds = [m[2], m[3]];
    if (refreshCounter % refreshRate == 0) {
        drawGraphs();    
    }
    refreshCounter++;
}

function updateWorker() {
    let pG = [];
    let pR = [];
    for (let i = 0; i < preyGrowth.length; i++) {
        pG.push(preyGrowth[i].checked);
    }
    for (let i = 0; i < predatorResponse.length; i++) {
        pR.push(predatorResponse[i].checked);
    }
    graphWorker.postMessage(["init", [N0Slider.value * 1, P0Slider.value * 1], variables, [stepSize, stepScaleCheckbox.checked], methodSelect.value, pG, pR]);

}

function graphAll(m) {
    allGraph.width = m[0][0].length;
    graph({ "list": m[0] }, allGraph, { "xlab": "Time", "ylab": "Population", "xlim": [0, xlim[1]], "ylim": [0, Math.max(...m[0][0], ...m[0][1])], "col": colors });
    allGraph.classList.remove("hide");
}

function download(m) {
    let time = []
    for (let i = 0; i < m[0][0].length; i++) {
        time.push((i * xInc).toPrecision(5));
    }
    let csv = `Time,Prey,Predator\n`;
    for (let i = 0; i < m[0][0].length; i++) {
        csv+=`${time[i]},${m[0][0][i]},${m[0][1][i]}\n`;
    }
    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    var url = URL.createObjectURL(blob);
    // Create a link to download it
    var a = document.createElement('a');
    a.href = url;
    a.setAttribute('download', "populations.csv");

    a.click();

}

function updateEquationText(){
    //eqs[0] = `${preyGrowth[0].checked ? "r * N" : preyGrowth[1].checked ? "r * N * ( 1 - N / K )" : ""} - ${predatorResponse[0].checked ? "a * P * N" : predatorResponse[1].checked ? "a * P * N / ( 1 + a * h * N )" : ""}`;
    //eqs[1] = `${predatorResponse[0].checked ? "f * a * P * N" : predatorResponse[1].checked ? "f * a * P * N / ( 1 + a * h * N )" : ""} - q * P`

    eqDisplays[0].innerHTML = "<math>";
    eqDisplays[1].innerHTML = "<math>";
}
