const checkButton = document.getElementById("checkIdentifier");
checkButton.addEventListener('click', () => check());
document.getElementById("clearStorage").addEventListener('click', () => clearStorage());
document.getElementById("hintButton").addEventListener('click', () => hint());
document.getElementById("picButton").addEventListener('click', () => newPicture());

const work = document.getElementById("work");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const hintBlank = document.getElementById("hint");

var reply = document.getElementById("reply");
var strict = document.getElementById("strict");
var allowOrders = document.getElementById("allowOrders");
var hintSci = document.getElementById("hintSci");

allowOrders.addEventListener('change', () => createList(allowOrders.checked));
hintSci.addEventListener('change', () => hintIdx = 1);

var speciesList = document.getElementById("speciesList");
var speciesIdx = -1;
var correctAnswer = "";
let species = "";
let random = 0;
let response = "";
let hintIdx = 1;
let localData = "";
let nextIndex = -1;
let timeBetweenCalls = 1500;
let timeBetweenCheckPress = 500;
let lastAPICall = Date.now()+1000;
let lastCheckPress = Date.now();

let apiCall = "https://api.inaturalist.org/v1/observations?q=$$TAXON_NAME$$&has[]=photos&quality_grade=research";
answer.addEventListener("keydown", (e) => process(e));
var list = [];
createList(allowOrders.checked);

function check() {
    if(Date.now()-lastAPICall<timeBetweenCalls){
        reply.innerHTML= `Please wait ${((timeBetweenCalls-(Date.now()-lastAPICall))/1000).toPrecision(3)} seconds before checking again`;
        return;
    }
    if(Date.now()-lastCheckPress<timeBetweenCheckPress){
        reply.innerHTML= `Please wait ${((timeBetweenCheckPress-(Date.now()-lastCheckPress))/1000).toPrecision(3)} seconds before checking again`;
        return;
    }

    if (fuzzyEquals(answer.value.toLowerCase().trim(), [...correctAnswer])) {
        reply.innerHTML = "Correct! The specimen is <span style = \"color: forestgreen;\">" + correctAnswer.join(" or ") + "</span>.";
        reply.style.setProperty('background-color', 'darkseagreen');
    }
    else {
        reply.innerHTML = "Incorrect. The specimen is <span style = \"color: lightsalmon;\">" + correctAnswer.join(" or ") + "</span>.";
        reply.style.setProperty('background-color', 'crimson');
        response.usage[random] -= .75;
    }
    lastCheckPress = Date.now()
    makeQuestion();
}
async function makeQuestion() {

    if (!localData) {
        if(Date.now()-lastAPICall<timeBetweenCalls){
            await new Promise(r => setTimeout(r, timeBetweenCalls-(Date.now()-lastAPICall)))
        }
        if(Date.now()-lastCheckPress<timeBetweenCheckPress){
            await new Promise(r => setTimeout(r, timeBetweenCheckPress-(Date.now()-lastCheckPress)))
        }
        speciesIdx = nextIndex;
        correctAnswer = list[speciesIdx];
        species = list[speciesIdx][0];
        response = JSON.parse(localStorage.getItem(species));
        if (!response || (Math.floor(Date.now() / 86400000) - response.date > 5) || response.usage.reduce((prev, cur) => prev + cur) > 50) {
            work.alt = "Choosing an image...";
            await new Promise(r => setTimeout(r, 1500))
            lastAPICall = Date.now();
            response = await fetch(apiCall.replaceAll("$$TAXON_NAME$$", species), { method: "GET" });
            response = (await response.json()).results;
            let photos = [];
            response.forEach((val) => photos.push(...val.photos.map((p) => p.url)))
            response = { "date": Math.floor(Date.now() / 86400000), "usage": new Array(photos.length).fill(0), "response": photos };
        }
    } else {
        response = JSON.parse(localData)
        localData = null;

    }

    let options = response.response;
    let weightedOptions = [];
    for (let i = 0; i < options.length; i++) {
        weightedOptions.push(...Array(Math.max(10 - Math.ceil(response.usage[i]), 1)).fill(i));
    }
    random = weightedOptions[Math.floor(Math.random() * weightedOptions.length)]
    response.usage[random]++;
    localStorage.setItem(species, JSON.stringify(response));
    work.alt = "identify this";

    answer.value = "";
    hintIdx = 1;
    question.textContent = "What taxon is this specimen a part of?";

    work.src = options[random].replaceAll("square", "small");

    nextIndex = Math.floor(Math.random() * list.length);
    species = list[nextIndex][0];
    let nextResponse = JSON.parse(localStorage.getItem(species));
    if (!nextResponse  || (Math.floor(Date.now() / 86400000) - nextResponse.date > 5) || nextResponse.usage.reduce((prev, cur) => prev + cur) > 50) {
    //    await new Promise(r => setTimeout(r, 1000))
        nextResponse = await fetch(apiCall.replaceAll("$$TAXON_NAME$$", species), { method: "GET" });
        nextResponse = (await nextResponse.json()).results;
        lastAPICall = Date.now();
        let nextPhotos = [];
        nextResponse.forEach((val) => nextPhotos.push(...val.photos.map((p) => p.url)))
        nextResponse = { "date": Math.floor(Date.now() / 86400000), "usage": new Array(nextPhotos.length).fill(0), "response": nextPhotos };
        localStorage.setItem(species, JSON.stringify(nextResponse));
    }
}

function contains(arr, val) {
    var bool = false;
    arr.forEach(element => {
        if (element === val || element == val)
            bool = true;
    });
    return bool;
}

function process(event) {
    if(Date.now()-lastAPICall<timeBetweenCalls){
        reply.innerHTML= `Please wait ${((timeBetweenCalls-(Date.now()-lastAPICall))/1000).toPrecision(3)} seconds before checking again`;
        return;
    }
    if(Date.now()-lastCheckPress<timeBetweenCheckPress){
        reply.innerHTML= `Please wait ${((100-(Date.now()-lastCheckPress))/1000).toPrecision(3)} seconds before checking again`;
        return;
    }
    if (event.key === "Enter")
        check();
}


function fuzzyEquals(one, twos) {
    for (let i = 0; i < twos.length; i++) {
        if ((!strict.checked && fuzzy(one, twos[i].toLowerCase())) || (strict.checked && one === twos[i].toLowerCase()))
            return true;
    }
    return false;

}
function fuzzy(guess, answer) {
    guess = guess.toLowerCase().trim();
    answer = answer.toLowerCase().trim();
    // checks if the strings are equals beforehand to skip the iteration if unnecessary
    if (guess === answer)
        return true;
    // variable that holds the number of correct characters
    let score = 0;
    //number of characters back or forwards a substring is allowed to be before being counted as nonexistent.
    var leniency = Math.ceil(answer.length ** .5);

    var fuzziness = 1 - answer.length ** -.45;
    //maximum possible score
    var neededFuzzyAmount = ((answer.length) * (answer.length + 1) * (answer.length + 2)) / 6 - answer.length;
    for (let i = guess.length; i >= 2; i--) {
        for (let s = 0; s <= (guess.length - i); s++) {
            for (let a = Math.max(0, s - leniency); a <= Math.min(s + leniency, answer.length - i); a++) {
                if (guess.substring(s, s + i) === answer.substring(a, a + i)) {
                    score += i;
                }
            }
            if (score > neededFuzzyAmount ** fuzziness)
                return true;
        }
    }
    //   console.log(score + " vs needed " + neededFuzzyAmount ** fuzziness)
    return score > neededFuzzyAmount ** fuzziness;
}

function createList(includeOrders) {
    let textList = speciesList.textContent.split("\n");
    let currentOrder = "";
    for (let i = 0; i < textList.length; i++) {
        textList[i] = textList[i].trim();
        if (/^\*?[\d]+.\s/.test(textList[i]) || (i < textList.length - 1 && !/^\*?[\d]+.\s/.test(textList[i + 1].trim()) && /^\*?[a-zA-Z]+.\s/.test(textList[i]))) {
            let tlist = textList[i].replaceAll(/^\*?[\w]+.\s/g, "").split(":");
            if (/^\*?[a-zA-Z]+.\s/.test(textList[i]))
                currentOrder = tlist[0];
            else if (includeOrders)
                tlist.push(currentOrder);
            list.push(tlist);
        }
    }
    if (localStorage.length > 0) {
        random = Math.floor(Math.random() * localStorage.length);
        localData = localStorage.getItem(localStorage.key(random))
        speciesIdx = list.map((arr) => arr[0]).indexOf(localStorage.key(random));
        correctAnswer = list[speciesIdx];
        species = localStorage.key(random);
    }

    makeQuestion();

}
function clearStorage() {
    localStorage.clear();
}
function hint() {
    hintBlank.innerText = list[speciesIdx][hintSci.checked ? 0 : 1].substring(0, hintIdx) + " _".repeat(Math.max(list[speciesIdx][hintSci.checked ? 0 : 1].length - hintIdx, 0));
    hintIdx++;
}
function newPicture(){
    let options = response.response;
    let weightedOptions = [];
    for (let i = 0; i < options.length; i++) {
        if(random!=i)
            weightedOptions.push(...Array(Math.max(10 - Math.ceil(response.usage[i]), 1)).fill(i));
    }
    random = weightedOptions[Math.floor(Math.random() * weightedOptions.length)]
    response.usage[random]+=.1;
    work.src = options[random].replaceAll("square", "small");
}