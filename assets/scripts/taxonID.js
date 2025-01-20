const checkButton = document.getElementById("checkIdentifier");
checkButton.addEventListener('click', () => check());
document.getElementById("clearStorage").addEventListener('click', () => clearStorage());
document.getElementById("hintButton").addEventListener('click', () => hint());
document.getElementById("picButton").addEventListener('click', () => newPicture());

const work = document.getElementById("work");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const hintBlank = document.getElementById("hint");
const quality = document.getElementById("quality");
const answerList = document.getElementById("possible-answers");


var individualCheckboxes = document.getElementById("individualCheckboxes");

var reply = document.getElementById("reply");
var strict = document.getElementById("strict");
var allowOrders = document.getElementById("allowOrders");
var hintSci = document.getElementById("hintSci");
var selectAll = document.getElementById("selectAll");
var showAnswerIfIncorrect = document.getElementById("showAnswerIfIncorrect");

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
let nextResponse = "";
let timeBetweenCalls = 1500;
let timeBetweenCheckPress = 500;
let lastAPICall = Date.now() + 1000;
let lastCheckPress = Date.now();
let waitingForAPICall = false; 
let url = [];


let apiCall = "https://api.inaturalist.org/v1/observations?q=$$TAXON_NAME$$&has[]=photos&quality_grade=research";
answer.addEventListener("keydown", (e) => process(e));
var list = [];
let taxonIdList = [];

createList(allowOrders.checked);

function check() {
    if (checkTiming())
        return;
    lastCheckPress = Date.now();

    if (fuzzyEquals(answer.value.toLowerCase().trim(), [...correctAnswer])) {
        let replyText = "Correct! The specimen is <span style = \"color: forestgreen;\">" + correctAnswer.join(" or ") + "</span>.<br>";
        for(let k of url){
            replyText+="| <a class = \"correct small\" href=\""+k+"\">Observation link</a> "
        }
        replyText+="|"
        reply.innerHTML = replyText;
        reply.style.setProperty('background-color', 'darkseagreen');
        makeQuestion();

    }
    else if (showAnswerIfIncorrect.checked){
        let replyText = "Incorrect. The specimen is <span style = \"color: lightsalmon;\">" + correctAnswer.join(" or ") + "</span>.<br>";
        for(let k of url){
            replyText+="| <a class = \"incorrect small\" href=\""+k+"\">Observation link</a> "
        }
        replyText+="|"
        reply.innerHTML = replyText;
        reply.style.setProperty('background-color', 'crimson');
        response.usage[random] -= .75;
        makeQuestion();

    }else{
        reply.innerHTML = "Incorrect. Try again.";
        reply.style.setProperty('background-color', 'crimson');
    }
    lastCheckPress = Date.now();
}
//makes the next question and starts querying for the question after
async function makeQuestion() {
    hintBlank.innerText = "";
    //availableList is the list of all checked families/orders
    let availableList = [];
    // list of available taxon ids
    let availableIds = [];
    // list of observation urls
    url = [];
    answerList.innerHTML = "";
    for (let i = 0; i < list.length; i++) {
        // gets the checkbox for the specific family/order and checks if it checked
        if (document.getElementById(list[i][0]).checked) {
            availableList.push(list[i]);
            availableIds.push(taxonIdList[i]);
            list[i].forEach(function(e){
                let ansOpt = document.createElement("option");
                ansOpt.value = e;
                answerList.appendChild(ansOpt);});
            // for(let j = 0;j<list[i].length;j++){

            // }
            // list[i].forEach((e)=>());
        }
    }
    //console.log(availableList);
    //console.log(availableIds);

    //failsafe in case they check nothing
    if (availableList.length == 0) {
        availableList.push(list[0]);
    }
    //localData is to decrease the load time of the first question using a taxon that is in localstorage
    if (!localData) {
        if (Date.now() - lastAPICall < timeBetweenCalls) {
            await new Promise(r => setTimeout(r, timeBetweenCalls - (Date.now() - lastAPICall)))
        }
        if (Date.now() - lastCheckPress < timeBetweenCheckPress) {
            await new Promise(r => setTimeout(r, timeBetweenCheckPress - (Date.now() - lastCheckPress)))
        }
        speciesIdx = nextIndex;

        //if next index is no longer a valid species, then choose a new index
        if (speciesIdx == -1 || speciesIdx >= availableList.length || availableList[speciesIdx][0] !== species)
            speciesIdx = Math.floor(Math.random() * availableList.length);
        correctAnswer = availableList[speciesIdx];
        if (species === availableList[speciesIdx][0] && nextResponse!=null) {
            species = availableList[speciesIdx][0];
            response = nextResponse;
        } else {
            species = availableList[speciesIdx][0];
            response = JSON.parse(localStorage.getItem("t+++" + species));
            if (!response || (Math.floor(Date.now() / 86400000) - response.date > 5) || response.usage.length > 0 && response.usage.reduce((prev, cur) => prev + cur) > 50) {
                work.alt = "Choosing an image...";
                await new Promise(r => setTimeout(r, 1500))
                lastAPICall = Date.now();
                waitingForAPICall = true;
                response = await requestData(species, availableIds[speciesIdx])

                let photos = [];
                response.forEach((val) => photos.push(...val.photos.map((p) => [p.url, val.uri])))
                response = { "date": Math.floor(Date.now() / 86400000), "usage": new Array(photos.length).fill(0), "response": photos };
            }
        }

    } else {
        response = JSON.parse(localData)
        localData = null;
    }
    console.log(species);

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

    console.log(options);
    url.push(options[random][1]);
    work.src = options[random][0].replaceAll("square", quality.value);

    nextIndex = Math.floor(Math.random() * availableList.length);
    species = availableList[nextIndex][0];
    nextResponse = JSON.parse(localStorage.getItem("t+++" + species));
    if (!nextResponse || (Math.floor(Date.now() / 86400000) - nextResponse.date > 5) || nextResponse.usage.reduce((prev, cur) => prev + cur) > 50) {
        //    await new Promise(r => setTimeout(r, 1000))
        lastAPICall = Date.now();
        waitingForAPICall = true;
        nextResponse = await requestData(species, availableIds[nextIndex])
        lastAPICall = Date.now();
        let nextPhotos = [];
        nextResponse.forEach((val) => nextPhotos.push(...val.photos.map((p) => [p.url, val.uri])))
        nextResponse = { "date": Math.floor(Date.now() / 86400000), "usage": new Array(nextPhotos.length).fill(0), "response": nextPhotos };
        localStorage.setItem("t+++" + species, JSON.stringify(nextResponse));
    }
    waitingForAPICall = false;

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
    if (event.key === "Enter"){
        if (answer.value.length==0)
            newPicture();            
        else if(checkTiming())
            return;
        else
            check();
    }


}
function checkTiming() {
    if(waitingForAPICall)
        lastCheckPress = Date.now();
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

async function createList(includeOrders) {
    if (speciesList.textContent === "") {
        let exList = await fetch("/assets/taxonid/lists/2025_so_ento.txt");
        exList = await exList.text();
        speciesList.textContent = exList;
    }

    let textList = speciesList.textContent.split("\n");
    individualCheckboxes.textContent = "";
    let currentOrder = "";
    list = [];
    for (let i = 0; i < textList.length; i++) {
        textList[i] = textList[i].trim();
        let id = "";
        if (/%[\d]{1,9}/.test(textList[i])) {
            id = textList[i].match(/%[\d]{1,9}/)[0].trim().substring(1);
            textList[i] = textList[i].replaceAll(/%[\d]{1,9}/g, "").trim();
        }

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
            tlist = tlist.map((e) => e.replaceAll("*", ""));

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
                    else {
                        list.push(tlist);
                        taxonIdList.push(id);

                    }


                }
                if (includeOrders && /^family\s/i.test(textList[i]))
                    tlist.push(currentOrder);
                if (/^family\s/i.test(textList[i])) {
                    list.push(tlist);
                    lab.classList.add("specific");
                    cb.classList.add(currentOrder);
                    taxonIdList.push(id);

                }
                individualCheckboxes.appendChild(lab);
            }

        } else if (textList[i].length > 0) {
            if (/%[\d]{1,9}/.test(textList[i])) {
                taxonIdList.push(textList[i].match(/%[\d]{1,9}/)[0].trim().substring(1));
                textList[i] = textList[i].replaceAll(/%[\d]{1,9}/g, "").trim();
            } else
                taxonIdList.push("");
            list.push(textList[i]);
        }
    }
    console.log(list);
    let validKeys = getValidKeys("t+++");
    if (validKeys.length > 0) {//needs to be rewritten // appears to be resolved
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
    url.push(options[random][1]);
    work.src = options[random][0].replaceAll("square", quality.value);
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
async function requestData(species, id) {
    let tresponse = "";
    if (id)
        tresponse = await fetch(apiCall.replaceAll("$$TAXON_NAME$$", id).replaceAll("q", "taxon_id"), { method: "GET" });
    else
        tresponse = await fetch(apiCall.replaceAll("$$TAXON_NAME$$", species), { method: "GET" });

    tresponse = (await tresponse.json()).results;
    if (tresponse.length == 0) {
        if (id)
            tresponse = await fetch(`https://api.inaturalist.org/v1/observations?taxon_id=${id}&has[]=photos`, { method: "GET" });
        else
            tresponse = await fetch(`https://api.inaturalist.org/v1/observations?q=${species}&has[]=photos`, { method: "GET" });
        tresponse = (await tresponse.json()).results;
    }
    return tresponse;

}

function isIconicTaxa(taxa){
    return taxa==="Plantae" || taxa==="Animalia" || taxa==="Mollusca" || taxa==="Reptilia" || taxa==="Aves" || taxa==="Amphibia" || taxa==="Actinopterygii" || taxa==="Mammalia" || taxa==="Insecta" || taxa==="Arachnida" || taxa==="Fungi" || taxa==="Protozoa" || taxa==="Chromista" 
}