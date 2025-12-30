const canvas = document.getElementById('graph');
const rInput = document.getElementById('r');
const colorInput = document.getElementById('color');
const xminInput = document.getElementById('minx');
const xmaxInput = document.getElementById('maxx');
canvas.width = Math.min(window.innerWidth*.9,1000);
const yminInput = document.getElementById('miny');
const ymaxInput = document.getElementById('maxy');

rInput.addEventListener('input', () => updateGraph());
colorInput.addEventListener('input', () => updateGraph());

xminInput.addEventListener('input', () => updateGraph());
xmaxInput.addEventListener('input', () => updateGraph());

yminInput.addEventListener('input', () => updateGraph());
ymaxInput.addEventListener('input', () => updateGraph());

updateGraph();
function updateGraph() {
    let func = "e ^ ( r * x ) - ( 1 + r ) ^ x".replaceAll("r", rInput.value);
    let xlim = [xminInput.value * 1, xmaxInput.value * 1].sort((a, b) => a - b);
    let ylim = [yminInput.value * 1, ymaxInput.value * 1].sort((a, b) => a - b);
    if (xlim[0] == xlim[1])
        xlim[1]++;
    if (ylim[0] == ylim[1])
        ylim[1]++;
    
    graph({"function":[func]}, canvas, {"xInc":.01, "xlab":"x", "ylab":"y", "title":"r - R", "xlim":xlim, "ylim":ylim, "col":[colorInput.value]})
}
