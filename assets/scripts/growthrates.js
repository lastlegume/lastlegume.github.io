const expRSlider = document.getElementById("exponential-r");
const expRValue = document.getElementById("exponential-r-value");
const expN0Slider = document.getElementById("exponential-n0");
const expN0Value = document.getElementById("exponential-n0-value");
const expGraph = document.getElementById("basicExponentialModel");

expRSlider.addEventListener('input', () => updateExpGraph());
expN0Slider.addEventListener('input', () => updateExpGraph());

const logisticRSlider = document.getElementById("logistic-r");
const logisticRValue = document.getElementById("logistic-r-value");
const logisticN0Slider = document.getElementById("logistic-n0");
const logisticN0Value = document.getElementById("logistic-n0-value");
const logisticKSlider = document.getElementById("logistic-K");
const logisticKValue = document.getElementById("logistic-K-value");
const logisticGraph = document.getElementById("logisticModel");
const logisticGraphdNdt = document.getElementById("logisticModeldNdt");
const logisticGraphdNdtN = document.getElementById("logisticModeldNdtN");
resizeGraphs();

logisticRSlider.addEventListener('input', () => updateLogisticGraph());
logisticN0Slider.addEventListener('input', () => updateLogisticGraph());
logisticKSlider.addEventListener('input', () => updateLogisticGraph());
window.onresize = 

updateExpGraph();
updateLogisticGraph();
function updateExpGraph() {
    expRValue.textContent = "r value: " + expRSlider.value;
    expN0Value.innerHTML = "<math><msub><mi>N</mi><mn>0</mn></msub></math> value: " + expN0Slider.value;

    let func = "N0 * e ^ ( r * x )";
    graph({ "function": func.replaceAll('r', expRSlider.value).replaceAll('N0', expN0Slider.value) }, expGraph, .005, "Time", "Population", [0, 7], [0, 100], "#00FFA0");
}
function updateLogisticGraph() {
    logisticRValue.textContent = "r value: " + logisticRSlider.value;
    logisticN0Value.innerHTML = "<math><msub><mi>N</mi><mn>0</mn></msub></math> value: " + logisticN0Slider.value;
    logisticKValue.textContent = "K value: " + logisticKSlider.value;

    let func = "N0 * ( K / ( ( K - N0 ) * e ^ ( -1 * r * x ) + N0 ) )".replaceAll('r', logisticRSlider.value).replaceAll('N0', logisticN0Slider.value).replaceAll('K', logisticKSlider.value);
    let diffFunc = "r * N * ( 1 - ( N / K ) )".replaceAll('r', logisticRSlider.value).replaceAll('K', logisticKSlider.value);

    let xlim = [0, 50]
    let xInc = (xlim[1] - xlim[0]) / (logisticGraph.width - 40);
    let x = xlim[0];
    let nVals = [];
    let dNdtVals = [];
    let dNdtNVals = [];
    for (let i = 0; i < logisticGraph.width - 40; i++) {
        nVals.push(solve(func.replaceAll('x', x)));
        x += xInc;
    }
    let nlim = [logisticN0Slider.value * 1, logisticKSlider.value * 1];
    //.sort((a,b) => a-b)
    let nInc = (nlim[1] - nlim[0]) / (logisticGraphdNdt.width - 40);
    let n = nlim[0];
    for (let i = 0; i < logisticGraphdNdt.width - 40; i++) {
        let dNdt = solve(diffFunc.replaceAll('N', n));
        dNdtVals.push(dNdt);
        dNdtNVals.push(dNdt / n);
        n += nInc;
    }

    graph({ "list": nVals }, logisticGraph, .005, "Time", "Population Size", xlim, [0, 1000], "#009FFF");
    graph({ "list": dNdtVals }, logisticGraphdNdt, .005, "Population Size", "Population Growth Rate", nlim, [Math.min.apply(null, dNdtVals), Math.max.apply(null, dNdtVals)], "#FF9FFF");
    graph({ "list": dNdtNVals }, logisticGraphdNdtN, .005, "Population Size", "Population Growth Rate Per Capita", nlim, [Math.min.apply(null, dNdtNVals), Math.max.apply(null, dNdtNVals)], "#55E0F0");

}

function resizeGraphs(){
    let width = document.getElementById("main_content").getBoundingClientRect().width;
    let height = window.innerHeight;
    let adjWidth = width - 220;
    expGraph.width = adjWidth<150?width:adjWidth;
    expGraph.height = Math.max(height * .75, 80);
    
    logisticGraph.width = adjWidth<150?width:adjWidth;
    logisticGraphdNdt.width = width * .45;
    logisticGraphdNdtN.width = width * .45;
    logisticGraph.height = Math.max(height * .63, 80);
    logisticGraphdNdt.height = Math.max(height * .35, 80);
    logisticGraphdNdtN.height = Math.max(height * .35, 80);
    
}