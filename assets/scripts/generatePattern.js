const pattern = document.getElementById("pattern");
const colorInput = document.getElementById("color");
const bgInput = document.getElementById("bgcolor");

document.getElementById("generate").addEventListener('click', generate)
generate();
function generate() {
    let ctx = pattern.getContext('2d');
    pattern.width = document.getElementById("width").value * 1;
    pattern.height = document.getElementById("height").value * 1;
    ctx.fillStyle = bgInput.value;  
    ctx.clearRect(0, 0, pattern.width, pattern.height);
    ctx.strokeStyle = colorInput.value;  
    ctx.lineWidth = 2;  

    let coords = [Math.floor(Math.random() * pattern.width), Math.floor(Math.random() * pattern.height)];
    for (let i = 0; i < 500; i++) {
        coords = [Math.floor(Math.random() * pattern.width), Math.floor(Math.random() * pattern.height)];
        ctx.moveTo(coords[0], coords[1]);

        for (let j = 0; j < 5; j++) {
            ctx.beginPath();
            ctx.arc(coords[0], coords[1], 80-12*j, 0, Math.PI*2);
            ctx.fill();
            ctx.arc(coords[0], coords[1], 80-12*j, 0, Math.PI*2);
            ctx.stroke();
            ctx.closePath();
        }
    }
}