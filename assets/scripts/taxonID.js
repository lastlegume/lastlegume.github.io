const checkButton = document.getElementById("checkIdentifier");
checkButton.addEventListener('click', () => check());
document.getElementById("clearStorage").addEventListener('click', () => clearStorage());
document.getElementById("hintButton").addEventListener('click', () => hint());
document.getElementById("picButton").addEventListener('click', () => newPicture());
document.getElementById("badImageButton").addEventListener('click', () => badImage());

const work = document.getElementById("work");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
const hintBlank = document.getElementById("hint");
const quality = document.getElementById("quality");
const answerList = document.getElementById("possible-answers");
var reply = document.getElementById("reply");

var individualCheckboxes = document.getElementById("individualCheckboxes");

//settings
var strict = document.getElementById("strict");
var allowOrders = document.getElementById("allowOrders");
var hintSci = document.getElementById("hintSci");
var selectAll = document.getElementById("selectAll");
var showAnswerIfIncorrect = document.getElementById("showAnswerIfIncorrect");
var autocompleteAnswers = document.getElementById("autocompleteAnswers");
var offline = document.getElementById("offlineMode");
var biasWrongs = document.getElementById("biasWrongs");
var repeatMisses = document.getElementById("repeatMisses");


//statistics
var streakDisplay = document.getElementById("streak");
var accuracyDisplay = document.getElementById("accuracy");
var fastestDisplay = document.getElementById("fastest");
var lastTimeDisplay = document.getElementById("lastTime");
var comMissedDisplay = document.getElementById("commonlyMissed");
var comCorrectDisplay = document.getElementById("commonlyCorrect");


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
let numCorrect = 0;
let totalNum = 0;
let curStreak = 0;
let qStartTime = Date.now();
work.addEventListener('load', (e)=>qStartTime = Date.now());

let fastestCorrect = 10000000000;
let lastTime = 10000000000;
let apiCall = ["https://api.inaturalist.org/v1/observations?q=$$TAXON_NAME$$&has[]=photos&quality_grade=research", "https://api.inaturalist.org/v1/observations?taxon_id=$$TAXON_ID$$&has[]=photos&quality_grade=research"];
answer.addEventListener("keydown", (e) => process(e));
var list = [];
let taxonIdList = [];
let missed = [];
let missedWoReview = [];
let correct = [];

createList(allowOrders.checked);

function check() {
    if (checkTiming())
        return;
    lastCheckPress = Date.now();
    totalNum++;

    if (fuzzyEquals(answer.value.toLowerCase().trim(), [...correctAnswer])) {
        let replyText = "Correct! The specimen is <span style = \"color: forestgreen;\">" + correctAnswer.join(" or ") + "</span>.<br>";
        for (let k of url) {
            replyText += "| <a class = \"correct small\" href=\"" + k + "\">Observation link</a> "
        }
        replyText += "|"
        reply.innerHTML = replyText;
        reply.style.setProperty('background-color', 'darkseagreen');
        numCorrect++;
        curStreak++;
        let qSolveTime = Date.now() - qStartTime;
        lastTime = qSolveTime;
        if (qSolveTime < fastestCorrect) {
            fastestCorrect = qSolveTime;
        }
        addToCounter(correctAnswer[0], correct);
        makeQuestion();

    }
    else if (showAnswerIfIncorrect.checked) {
        let replyText = "Incorrect. The specimen is <span style = \"color: lightsalmon;\">" + correctAnswer.join(" or ") + "</span>.<br>";
        for (let k of url) {
            replyText += "| <a class = \"incorrect small\" href=\"" + k + "\">Observation link</a> "
        }
        replyText += "|";
        reply.innerHTML = replyText;
        reply.style.setProperty('background-color', 'crimson');
        response.usage[random] -= .75;
        curStreak = 0;
        addToCounter(correctAnswer[0], missed);
        addToCounter(correctAnswer[0], missedWoReview);

        makeQuestion();


    } else {
        reply.innerHTML = "Incorrect. Try again.";
        reply.style.setProperty('background-color', 'crimson');
        curStreak = 0;
    }
    updateStats();
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
    // let extraList = [];
    for (let i = 0; i < list.length; i++) {
        // gets the checkbox for the specific family/order and checks if it checked
        if (document.getElementById(list[i][0]).checked) {
            availableList.push(list[i]);

            availableIds.push(taxonIdList[i]);
            if (autocompleteAnswers.checked)
                list[i].forEach(function (e) {
                    let ansOpt = document.createElement("option");
                    ansOpt.value = e.trim();
                    answerList.appendChild(ansOpt);
                });
            //failed biasWrongs implementation - needs species selection to be rewritten to work
            // if (biasWrongs.checked) {
            //     let listObject = missed.filter((e) => list[i].includes(e.species));
            //     let wrongReps = 0;
            //     if (listObject.length > 0)
            //         wrongReps += listObject[0].count;
            //     listObject = correct.filter((e) => list[i].includes(e.species));
            //     if (listObject.length > 0)
            //         wrongReps -= listObject[0].count;
            //     extraList.push(...Array(Math.max(0, (wrongReps) * 4)).fill(list[i])); //might be too heavy of a weight

            // }
            // for(let j = 0;j<list[i].length;j++){

            // }
            // list[i].forEach((e)=>());
        }
    }
    //console.log(availableList);
    //console.log(availableIds);
    //availableList.push(...extraList);
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
        if (offline.checked) {
            let validKeys = getValidKeys("t+++");
            if (validKeys.length == 0) {
                reply.innerHTML = "An image <span style=\"color: LemonChiffon;\">could not be chosen</span>. Please disable offline mode, connect to the internet, and try again.";
                reply.style.setProperty('background-color', 'burlywood');
                return;
            }
            response = JSON.parse(localStorage.getItem("t+++" + species));
            if (!response) {
                random = validKeys[Math.floor(Math.random() * validKeys.length)];
                species = localStorage.key(random).substring(4);
                speciesIdx = list.map((arr) => arr[0]).indexOf(species);
                let offlineCounter = 0;
                let tempOfflineAvailable = availableList.map((e) => e[0]);
                while (offlineCounter < 1000 && !tempOfflineAvailable.includes(species)) {
                    offlineCounter++;
                    random = validKeys[Math.floor(Math.random() * validKeys.length)];
                    species = localStorage.key(random).substring(4);
                    speciesIdx = list.map((arr) => arr[0]).indexOf(species);
                }
                if (offlineCounter > 999) {
                    reply.innerHTML = "An image from the desired list <span style=\"color: LemonChiffon;\">could not be chosen</span>. Please disable offline mode, connect to the internet, and try again.";
                    reply.style.setProperty('background-color', 'burlywood');
                }
            }
        }
        correctAnswer = availableList[speciesIdx];
        //tests if the species is within the list of available species
        if (availableList.map((e) => e[0]).includes(species) && nextResponse != null) {
            //species = availableList[speciesIdx][0];
            response = nextResponse;
        } else {
            species = availableList[speciesIdx][0];
            response = JSON.parse(localStorage.getItem("t+++" + species));
            //checks if response exists or if it is outdated/overused and we are not using offline mode
            if (!response || !offline.checked && ((Math.floor(Date.now() / 86400000) - response.date > 5) || response.usage.length > 0 && response.usage.reduce((prev, cur) => prev + cur) > 50)) {
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
    //console.log(species);
    // choose image of species
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

    //console.log(options);
    url.push(options[random][1]);
    work.src = options[random][0].replaceAll("square", quality.value);
    qStartTime = Date.now();
    //
    let totalWrong = 0;
    if (repeatMisses.checked&&missedWoReview.length>0) {
        totalWrong = missedWoReview.map((e) => e.count).reduce((p, c) => p + c);
    }
    //randomly chooses whether to choose a missed species or new one
    if (Math.random() >= 0.49 - 2 ** (-1 - 0.3 * totalWrong))
        nextIndex = Math.floor(Math.random() * availableList.length);
    else {
        let availableMissedList = [];
        let availableSpecies = availableList.map((ele) => ele[0]);
        missedWoReview.forEach(function (e) {
            if (availableSpecies.includes(e.species))
                availableMissedList.push(...Array(e.count).fill(e));
        });
        if(availableMissedList.length==0)
            nextIndex = Math.floor(Math.random() * availableList.length);
        else{
            let tNIdx = Math.floor(Math.random()* availableMissedList.length);
            
            for(let i = missedWoReview.length-1;i>=0;i--){
                if(missedWoReview[i].species===availableMissedList[tNIdx].species){
                    missedWoReview[i].count--;
                    if(missedWoReview[i].count==0)
                        missedWoReview.splice(i,1);
                }
            }
            nextIndex = list.map((e)=>e[0]).indexOf(availableMissedList[tNIdx].species);
            console.log(`Chose ${nextIndex} (${list[nextIndex][0]}) because it was previously missed.` );
        }
    }

    species = availableList[nextIndex][0];
    nextResponse = JSON.parse(localStorage.getItem("t+++" + species));
    if (!nextResponse || !offline.checked && ((Math.floor(Date.now() / 86400000) - nextResponse.date > 5) || nextResponse.usage.reduce((prev, cur) => prev + cur) > 50)) {
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
    if (event.key === "Enter") {
        if (answer.value.length == 0)
            newPicture();
        else if (checkTiming())
            return;
        else
            check();
    }


}
function checkTiming() {
    if (waitingForAPICall)
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
        random = validKeys[Math.floor(Math.random() * validKeys.length)];
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
        tresponse = await fetch(apiCall[1].replaceAll("$$TAXON_ID$$", id), { method: "GET" });
    else
        tresponse = await fetch(apiCall[0].replaceAll("$$TAXON_NAME$$", species), { method: "GET" });
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

function isIconicTaxa(taxa) {
    return taxa === "Plantae" || taxa === "Animalia" || taxa === "Mollusca" || taxa === "Reptilia" || taxa === "Aves" || taxa === "Amphibia" || taxa === "Actinopterygii" || taxa === "Mammalia" || taxa === "Insecta" || taxa === "Arachnida" || taxa === "Fungi" || taxa === "Protozoa" || taxa === "Chromista"
}

function badImage() {
    response.usage[random] += 4;
    newPicture();
}

function updateStats() {
    streakDisplay.innerText = "Current streak: " + curStreak;
    accuracyDisplay.innerText = "Accuracy: " + (numCorrect / totalNum * 100).toFixed(2) + "% (" + `${numCorrect}/${totalNum})`;
    if (lastTime != 10000000000)
        lastTimeDisplay.innerText = "Last solve: " + toReadableTime(lastTime);
    if (fastestCorrect != 10000000000)
        fastestDisplay.innerText = "Fastest solve: " + toReadableTime(fastestCorrect);
    comMissedDisplay.innerText = "";
    let fiveList = missed.sort((a, b) => b.count - a.count).slice(0, 5);
    if (fiveList.length > 0)
        fiveList.forEach((e) => comMissedDisplay.innerText += `${e.species}: ${e.count}\n`);
    comCorrectDisplay.innerText = "";
    fiveList = correct.sort((a, b) => b.count - a.count).slice(0, 5);
    if (fiveList.length > 0)
        fiveList.forEach((e) => comCorrectDisplay.innerText += `${e.species}: ${e.count}\n`);

}

function toReadableTime(t) {
    let tString = "" + t % 1000 + "ms";
    t = Math.floor(t / 1000);
    if (t > 0) {
        tString = t + "s, " + tString;
        t = Math.floor(t / 60);
        if (t > 0)
            tString = t % 60 + "m, " + tString;
        t = Math.floor(t / 60);
        if (t > 0)
            tString = t % 60 + "hr, " + tString;
        t = Math.floor(t / 24);
        if (t > 0)
            tString = t % 24 + "d, " + tString;
    }
    return tString;
}

function addToCounter(idx, list) {
    let lkeys = list.map((e) => e.species);
    if (lkeys.includes(idx))
        list[lkeys.indexOf(idx)].count++;
    else
        list.push({ "species": idx, "count": 1 });
}