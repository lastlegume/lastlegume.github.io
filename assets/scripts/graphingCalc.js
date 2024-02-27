const canvas = document.getElementById('graph');
const functionInput = document.getElementById('function');
const colorInput = document.getElementById('color');
const xminInput = document.getElementById('minx');
const xmaxInput = document.getElementById('maxx');
canvas.width = Math.min(window.innerWidth*.9,1000);
const yminInput = document.getElementById('miny');
const ymaxInput = document.getElementById('maxy');

functionInput.addEventListener('input', () => updateGraph());
colorInput.addEventListener('input', () => updateGraph());

xminInput.addEventListener('input', () => updateGraph());
xmaxInput.addEventListener('input', () => updateGraph());

yminInput.addEventListener('input', () => updateGraph());
ymaxInput.addEventListener('input', () => updateGraph());

updateGraph();
function updateGraph() {
    let func = functionInput.value;
    let xlim = [xminInput.value * 1, xmaxInput.value * 1].sort((a, b) => a - b);
    let ylim = [yminInput.value * 1, ymaxInput.value * 1].sort((a, b) => a - b);
    if (xlim[0] == xlim[1])
        xlim[1]++;
    if (ylim[0] == ylim[1])
        ylim[1]++;
    func = func.replaceAll(/\s?\(\s?/g, " ( ");
    func = func.replaceAll(/\s?\)\s?/g, " ) ");
    func = func.replaceAll(/\s?(-?[\d]+?)x\s?/g, ` $1 * x `);
    func = func.replaceAll(/\s?([\+\/\*\^])\s?/g, ` $1 `);
    func = func.replaceAll(/\s?([\-][^\d]+?)\s?/g, ` $1 `);
    func = func.replaceAll(/\s?log\s?/g, ` log `);
    func = func.replaceAll(/\s?ln\s?/g, ` ln `);
    func = func.replaceAll(/\s?sin\s?/g, ` sin `);
    func = func.replaceAll(/\s?cos\s?/g, ` cos `);
    func = func.replaceAll(/\s?tan\s?/g, ` tan `);
    func = func.replaceAll(/\s?csc\s?/g, ` csc `);
    func = func.replaceAll(/\s?sec\s?/g, ` sec `);
    func = func.replaceAll(/\s?cot\s?/g, ` cot `);
    func = func.replaceAll(/\s?-\s?x\s?/g, ` -1 * x `);

    func = func.replaceAll(/\s?\)\s?\(\s?/g, " ) * ( ");


    func = func.replaceAll(/\s+?/g, " ").trim();
    console.log(func);
    graph(func, canvas, .01, "x", "y", xlim, ylim, colorInput.value)
}
