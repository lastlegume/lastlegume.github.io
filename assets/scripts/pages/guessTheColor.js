const box = document.getElementById("box");
const check = document.getElementById("check");
const errorDiv = document.getElementById("error");
const selectType = document.getElementById("type");

const RGBs = document.getElementsByClassName('rgb')
const HSLs = document.getElementsByClassName('hsl')

check.addEventListener('click', checkColor)
let color = [];
chooseColor();
adjustVisibility();

function chooseColor(){
    color = [Math.random()*256, Math.random()*256, Math.random()*256];
    console.log(`Answer: ${color}`);
    box.style.backgroundColor = `rgb(${color.join(",")})`;
}

function checkColor(){
    errorDiv.innerHTML = `<h5>Error:</h5> (${color.map((v,i)=>v-RGBs[i].value).join(",")})\n<h5>Exact color:</h5> (${color.join(",")})`
    chooseColor();
}

function adjustVisibility(){
    let type = selectType.value;
    let typeDivs = document.getElementsByClassName("type-div");
    for(let i = 0;i<typeDivs.length;i++){
        if(typeDivs[i].id===`${type}-div`){
            typeDivs[i].classList.remove("hide");
        }else
           typeDivs[i].classList.add("hide");

    }
}