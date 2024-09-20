const checkButton = document.getElementById("checkIdentifier");
checkButton.addEventListener('click', () => check());
document.getElementById("clearStorage").addEventListener('click', () => clearStorage());
document.getElementById("hintButton").addEventListener('click', () => hint());
document.getElementById("picButton").addEventListener('click', () => newPicture());

const work = document.getElementById("work");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const hintBlank = document.getElementById("hint");

var individualCheckboxes = document.getElementById("individualCheckboxes");

var reply = document.getElementById("reply");
var strict = document.getElementById("strict");
var allowOrders = document.getElementById("allowOrders");
var hintSci = document.getElementById("hintSci");
var selectAll = document.getElementById("selectAll");
allowOrders.addEventListener('change', () => createList(allowOrders.checked));
selectAll.addEventListener('change', () => adjustAll());

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
let lastAPICall = Date.now() + 1000;
let lastCheckPress = Date.now();

let apiCall = "https://api.inaturalist.org/v1/observations?q=$$TAXON_NAME$$&has[]=photos&quality_grade=research";
answer.addEventListener("keydown", (e) => process(e));
var list = [];
createList(allowOrders.checked);

function check() {
    if (checkTiming())
        return;

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
    let availableList = [];
    for (let i = 0; i < list.length; i++) {
        if (document.getElementById(list[i][0]).checked)
            availableList.push(list[i]);
    }
    console.log(availableList);
    if (availableList.length == 0) {
        availableList.push(list[0]);
    }
    if (!localData) {
        if (Date.now() - lastAPICall < timeBetweenCalls) {
            await new Promise(r => setTimeout(r, timeBetweenCalls - (Date.now() - lastAPICall)))
        }
        if (Date.now() - lastCheckPress < timeBetweenCheckPress) {
            await new Promise(r => setTimeout(r, timeBetweenCheckPress - (Date.now() - lastCheckPress)))
        }
        speciesIdx = nextIndex;
        if (speciesIdx == -1 || speciesIdx >= availableList.length || availableList[speciesIdx][0] !== nextIndex)
            speciesIdx = Math.floor(Math.random() * availableList.length);
        correctAnswer = availableList[speciesIdx];
        species = availableList[speciesIdx][0];
        response = JSON.parse(localStorage.getItem("t+++" + species));
        if (!response || (Math.floor(Date.now() / 86400000) - response.date > 5) || response.usage.length > 0 && response.usage.reduce((prev, cur) => prev + cur) > 50) {
            work.alt = "Choosing an image...";
            await new Promise(r => setTimeout(r, 1500))
            lastAPICall = Date.now();
            response = await fetch(apiCall.replaceAll("$$TAXON_NAME$$", species), { method: "GET" });
            response = (await response.json()).results;
            if (response.length == 0) {
                response = await fetch(`https://api.inaturalist.org/v1/observations?q=${species}&has[]=photos`, { method: "GET" });
                response = (await response.json()).results;
            }

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
    localStorage.setItem("t+++" + species, JSON.stringify(response));
    work.alt = "Identify this";

    answer.value = "";
    hintIdx = 1;
    question.textContent = "What taxon is this specimen a part of?";

    work.src = options[random].replaceAll("square", "small");

    nextIndex = Math.floor(Math.random() * availableList.length);
    species = availableList[nextIndex][0];
    let nextResponse = JSON.parse(localStorage.getItem("t+++" + species));
    if (!nextResponse || (Math.floor(Date.now() / 86400000) - nextResponse.date > 5) || nextResponse.usage.reduce((prev, cur) => prev + cur) > 50) {
        //    await new Promise(r => setTimeout(r, 1000))
        nextResponse = await fetch(apiCall.replaceAll("$$TAXON_NAME$$", species), { method: "GET" });
        nextResponse = (await nextResponse.json()).results;
        if (response.length == 0) {
            response = await fetch(`https://api.inaturalist.org/v1/observations?q=${species}&has[]=photos`, { method: "GET" });
            response = (await response.json()).results;
        }
        lastAPICall = Date.now();
        let nextPhotos = [];
        nextResponse.forEach((val) => nextPhotos.push(...val.photos.map((p) => p.url)))
        nextResponse = { "date": Math.floor(Date.now() / 86400000), "usage": new Array(nextPhotos.length).fill(0), "response": nextPhotos };
        localStorage.setItem("t+++" + species, JSON.stringify(nextResponse));
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
    if (checkTiming())
        return;
    if (event.key === "Enter")
        check();
}
function checkTiming() {
    if (Date.now() - lastAPICall < timeBetweenCalls) {
        reply.innerHTML = `Please wait <span style="color: LemonChiffon;">${((timeBetweenCalls - (Date.now() - lastAPICall)) / 1000).toPrecision(3)}</span> seconds before checking again`;
        reply.style.setProperty('background-color', 'burlywood');
        return true;
    }
    if (Date.now() - lastCheckPress < timeBetweenCheckPress) {
        reply.innerHTML = `Please wait <span style="color: LemonChiffon;">${((timeBetweenCheckPress - (Date.now() - lastCheckPress)) / 1000).toPrecision(3)}</span> seconds before checking again`;
        reply.style.setProperty('background-color', 'burlywood');

        return true;
    }
    return false;
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
    individualCheckboxes.textContent = "";
    let currentOrder = "";
    list = [];
    for (let i = 0; i < textList.length; i++) {
        textList[i] = textList[i].trim();
        // for 2015 list
        if (/^\*?[\w]{1,3}\.\s/.test(textList[i])) {
            //        if (/^\*?[\d]+.\s/.test(textList[i]) || (i < textList.length - 1 && !/^\*?[\d]+.\s/.test(textList[i + 1].trim()) && /^\*?[a-zA-Z]+.\s/.test(textList[i]))) {
            let tlist = textList[i].replaceAll(/^\*?[\w]+\.\s/g, "").split(":");
            tlist = tlist.map((e) => e.split("/"));
            tlist = [].concat(...tlist);
            tlist = tlist.map((e) => e.split(", "));
            tlist = [].concat(...tlist);
            let lab = document.createElement("label");
            let cb = document.createElement("input")
            cb.type = "checkbox"
            cb.id = tlist[0];
            cb.checked = true;
            lab.appendChild(cb);
            lab.appendChild(document.createTextNode(textList[i].replaceAll(/^\*?[\w]+.\s/g, "")));
            lab.appendChild(document.createElement("br"));
            cb.classList.add("indivCb");

            if (/^\*?[a-zA-Z]{1,2}\.\s/.test(textList[i])) {
                currentOrder = tlist[0];
                if (/^\*?[\d]{1,2}\.\s/.test(textList[i + 1].trim()))
                    cb.addEventListener('change', () => updateCheckboxes())
                else
                    list.push(tlist);


            }
            if (includeOrders && (/^\*?[\d]+\.\s/.test(textList[i])))
                tlist.push(currentOrder);
            if (/^\*?[\d]+\.\s/.test(textList[i])) {
                list.push(tlist);
                lab.classList.add("specific");
                cb.classList.add(currentOrder);
            }
            individualCheckboxes.appendChild(lab);
            // for 2024 list 
        } else if (/^(sub)*?(order|family|class)\s/gi.test(textList[i])) {
            let tlist = textList[i].replaceAll(/^(sub)*?(order|family|class)\s/gi, "").split(":");
            tlist = tlist.map((e) => e.split("/"));
            tlist = [].concat(...tlist);
            tlist = tlist.map((e) => e.split(", "));
            tlist = [].concat(...tlist);
            if (/^(sub)*?class\s/gi.test(textList[i])) {
                let h6 = document.createElement("h6");
                h6.innerText = textList[i].replaceAll(/^(sub)*?(order|family|class)\s/gi, "");
                individualCheckboxes.appendChild(h6);
            } else {
                let lab = document.createElement("label");
                let cb = document.createElement("input")
                cb.type = "checkbox"
                cb.id = tlist[0];
                cb.checked = true;
                lab.appendChild(cb);
                lab.appendChild(document.createTextNode(textList[i].replaceAll(/^(sub)*?(order|family|class)\s/gi, "").replaceAll(/\s?:\s?/g, ": ")));
                lab.appendChild(document.createElement("br"));
                cb.classList.add("indivCb");

                if (/^order\s/i.test(textList[i])) {
                    currentOrder = tlist[0];
                    if (/^family\s/i.test(textList[i + 1].trim()))
                        cb.addEventListener('change', () => updateCheckboxes())
                    else
                        list.push(tlist);


                }
                if (includeOrders && /^family\s/i.test(textList[i]))
                    tlist.push(currentOrder);
                if (/^family\s/i.test(textList[i])) {
                    list.push(tlist);
                    lab.classList.add("specific");
                    cb.classList.add(currentOrder);
                }
                individualCheckboxes.appendChild(lab);
            }

        } else if (textList[i].length > 0) {
            list.push(textList[i]);
        }
    }
    console.log(list);
    let validKeys = getValidKeys("t+++");
    if (validKeys.length > 0) {//needs to be rewritten
        random = Math.floor(Math.random() * validKeys.length);
        localData = localStorage.getItem(localStorage.key(random))
        species = localStorage.key(random).substring(4);
        speciesIdx = list.map((arr) => arr[0]).indexOf(species);
        correctAnswer = list[speciesIdx];
    }

    makeQuestion();

}
function clearStorage() {
    localStorage.clear();
}
function hint() {
    hintBlank.innerText = correctAnswer[hintSci.checked ? 0 : 1].substring(0, hintIdx) + " _".repeat(Math.max(correctAnswer[hintSci.checked ? 0 : 1].length - hintIdx, 0));
    hintIdx++;
}
function newPicture() {
    let options = response.response;
    let weightedOptions = [];
    for (let i = 0; i < options.length; i++) {
        if (random != i)
            weightedOptions.push(...Array(Math.max(10 - Math.ceil(response.usage[i]), 1)).fill(i));
    }
    random = weightedOptions[Math.floor(Math.random() * weightedOptions.length)]
    response.usage[random] += .1;
    work.src = options[random].replaceAll("square", "small");
}
function updateCheckboxes() {
    let cbs = document.getElementsByClassName('indivCb');
    for (let i = 0; i < cbs.length; i++) {
        let specificCbs = document.getElementsByClassName(cbs[i].id);
        for (let j = 0; j < specificCbs.length; j++) {
            specificCbs[j].checked = cbs[i].checked;
        }
    }
}
function adjustAll() {
    selectAll.parentNode.childNodes[1].textContent = selectAll.checked ? "Deselect All" : "Select All";
    let cbs = document.getElementsByClassName('indivCb');
    for (let i = 0; i < cbs.length; i++) {
        cbs[i].checked = selectAll.checked;
    }
}
function getValidKeys(str) {
    let list = [];
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i).substring(0, str.length) === str) {
            list.push(i);
        }
    }
    return list;
}