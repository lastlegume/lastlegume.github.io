const timeGraph = document.getElementById("timeGraph");
const slopeGraph = document.getElementById("slopeGraph");

//settings
const stepButton = document.getElementById("step");
const playButton = document.getElementById("play");
const resetButton = document.getElementById("reset");

const stepSizeInput = document.getElementById("step-size");
const methodSelect = document.getElementById("method");
const preyGrowth = document.getElementsByClassName("prey-growth");
const predatorResponse = document.getElementsByClassName("predator-func-response");

stepButton.addEventListener('click', step);
playButton.addEventListener('click', toggle);
resetButton.addEventListener('click', reset);

for (let i = 0; i < preyGrowth.length; i++) {
    preyGrowth[i].addEventListener('change', updateEquations);
}
for (let i = 0; i < predatorResponse.length; i++) {
    predatorResponse[i].addEventListener('change', updateEquations);
}
//parameters
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

//js variables 
let populations = [[N0Slider.value * 1], [P0Slider.value * 1]];
let slopes = [[],[]];
var eqs = ["", ""]
let running = false;
let currentT = 0;
let colors = ["#00FFA0", "#FFFF00"];

let maxPop = -1;
let maxSlope = -1;
let minSlope = 1;
updateVals();
updateEquations();

let intID = 0;

function updateVals() {
    running = false;
    reset();

    rValue.textContent = "r value: " + rSlider.value;
    aValue.textContent = "a value: " + aSlider.value;
    KValue.textContent = "K value: " + KSlider.value;
    fValue.textContent = "f value: " + fSlider.value;
    qValue.textContent = "q value: " + qSlider.value;
    hValue.textContent = "h value: " + hSlider.value;

    N0Value.innerHTML = "<math><msub><mi>N</mi><mn>0</mn></msub></math> value: " + N0Slider.value;
    P0Value.innerHTML = "<math><msub><mi>P</mi><mn>0</mn></msub></math> value: " + P0Slider.value;

}
function step() {
    if(!running){
        clearInterval(intID);
        return;
    }
    slopes[0].push(solve(eqs[0].replaceAll("r", rSlider.value).replaceAll("K", KSlider.value).replaceAll("h", hSlider.value).replaceAll("f", fSlider.value).replaceAll("q", qSlider.value).replaceAll("a", aSlider.value).replaceAll("N", populations[0][currentT]).replaceAll("P", populations[1][currentT])));
    slopes[1].push(solve(eqs[1].replaceAll("r", rSlider.value).replaceAll("K", KSlider.value).replaceAll("h", hSlider.value).replaceAll("f", fSlider.value).replaceAll("q", qSlider.value).replaceAll("a", aSlider.value).replaceAll("N", populations[0][currentT]).replaceAll("P", populations[1][currentT])));
    populations[0].push(populations[0][currentT] * 1 + stepSizeInput.value * slopes[0][currentT]);
    populations[1].push(populations[1][currentT] * 1 + stepSizeInput.value * slopes[1][currentT]);
    if (populations[0].length > timeGraph.width - 80) {
        populations[0] = populations[0].slice(1);
        populations[1] = populations[1].slice(1);
        slopes[0] = slopes[0].slice(1);
        slopes[1] = slopes[1].slice(1);
        currentT--;
    }
    currentT++;
    if(populations[0][currentT]>maxPop)
        maxPop = populations[0][currentT];
    if(populations[1][currentT]>maxPop)
        maxPop = populations[1][currentT];
    maxSlope = Math.max(slopes[0][currentT-1], maxSlope);
    maxSlope = Math.max(slopes[1][currentT-1], maxSlope);
    minSlope = Math.min(slopes[0][currentT-1], minSlope);
    minSlope = Math.min(slopes[1][currentT-1], minSlope);

    graph({ "list": populations }, timeGraph, { "xInc": .005, "xlab": "Time", "ylab": "Population", "xlim": [0, 10], "ylim": [0, maxPop], "col": colors });
    graph({ "list": slopes }, slopeGraph, { "xInc": .005, "xlab": "Time", "ylab": "Growth Rate", "xlim": [0, 10], "ylim": [minSlope, maxSlope], "col": colors });

}
function toggle() {
    running = !running;
    playButton.innerText = running?"Stop":"Start";
    intID = setInterval(step, 10);
    //reset();
    //graph({"list": populations}, timeGraph, { "xInc": .005, "xlab": "Time", "ylab": "Population", "xlim": [0, 10], "ylim": [0, 100], "col": colors });

}
function updateEquations() {
    running = false;
    reset();
    eqs = ["", ""]
    eqs[0] = `${preyGrowth[0].checked ? "r * N" : preyGrowth[1].checked ? "r * N * ( 1 - N / K )" : ""} - ${predatorResponse[0].checked ? "a * P * N" : predatorResponse[1].checked ? "a * P * N / ( 1 + a * h * N )" : ""}`;
    eqs[1] = `${predatorResponse[0].checked ? "f * a * P * N" : predatorResponse[1].checked ? "f * a * P * N / ( 1 + a * h * N )" : ""} - q * P`
    console.log(eqs);
}
function reset() {
    running = false;
    populations = [[N0Slider.value], [P0Slider.value]];
    slopes = [[],[]];
    currentT = 0;
    graph({ "list": populations }, timeGraph, { "xInc": .005, "xlab": "Time", "ylab": "Population", "xlim": [0, 10], "ylim": [0, Math.max(...populations[0],...populations[1])], "col": colors });
    graph({ "list": slopes }, slopeGraph, { "xInc": .005, "xlab": "Time", "ylab": "Population", "xlim": [0, 10], "ylim": [0, 100], "col": colors });

}