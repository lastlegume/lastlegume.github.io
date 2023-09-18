const checkButton = document.getElementById("checkIdentifier");
checkButton.addEventListener('click', () => check());
const allWorks = document.getElementById("allWorks");
allWorks.addEventListener('change', () => showAllWorks())

var identifiers = [];

const work = document.getElementById("work");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
var reply = document.getElementById("reply");
var strict = document.getElementById("strict");
var range = document.getElementById("range");

var workIndex = 0;
var identifier = "";
const unitBoxes = document.getElementsByClassName("unit-checkbox");
const unitDivs = document.getElementsByClassName("unit-div");
const idBoxes = document.getElementsByClassName("identifier-checkbox");
for (let i = 0; i < unitBoxes.length; i++) {
    unitBoxes[i].addEventListener('change', () => update());
}
const weights = [.04, .15, .21, .21, .06, .06, .04, .08, .04, .11];
var subtype = 0;
answer.addEventListener("keydown", (e) => process(e));
const request = new XMLHttpRequest();
request.addEventListener('load', readCSV);
request.open("GET", "/assets/arthist/arthistidentifiers.csv");
request.send();
//https://lastlegume.github.io
function check() {
    var correctAnswer = identifiers[workIndex][identifier].trim();
    if (workIndex == 20 && identifiers[0][identifier] === "Date")
        correctAnswer = correctAnswer.split("/")[subtype];
    if (equals(answer.value.toLowerCase().trim(), correctAnswer.toLowerCase())) {
        reply.innerHTML = "Correct! The <span style = \"color: forestgreen;\">" + identifiers[0][identifier].toLowerCase() + "</span> of <span style = \"color: forestgreen;\">" + identifiers[workIndex][1] + "</span> is <span style = \"color: forestgreen;\">" + correctAnswer + "</span>.";
        reply.style.setProperty('background-color', 'darkseagreen');
    }
    else {
        reply.innerHTML = "Incorrect. The <span style = \"color: lightsalmon;\">" + identifiers[0][identifier].toLowerCase() + "</span> of <span style = \"color: lightsalmon;\">" + identifiers[workIndex][1] + "</span> is <span style = \"color: lightsalmon;\">" + correctAnswer + "</span>.";
        reply.style.setProperty('background-color', 'crimson');
    }

    makeQuestion();
}
function readCSV() {
    identifiers = this.responseText.split("\n");
    identifiers.pop(identifiers.length - 1);
    for (let i = 0; i < identifiers.length; i++) {
        var string = identifiers[i].replaceAll("\r", "");
        // console.log(string);
        identifiers[i] = [];
        var start = 0;
        for (let j = 0; j < string.length; j++) {
            if (string.substring(j, j + 1) === ",") {
                identifiers[i].push(string.substring(start, j));
                start = j + 1;
                while (string.substring(j + 1, j + 2) === "\"") {
                    start = j + 2;
                    j += 2;
                    while (string.substring(j, j + 1) !== "\"" || string.substring(j + 1, j + 2) !== ",")
                        j++;
                    j++;
                    identifiers[i].push(string.substring(start, j - 1));
                    start = j + 1;
                }
            }
        }
        identifiers[i].push(string.substring(start));
    }
    makeQuestion();

    //  console.log(identifiers);

}
function makeQuestion() {
    answer.value = "";
    //make checkboxes of class period and then iterate through with for loop. for each that is true, add i+1 to the list
    var units = [];
    if (allWorks.checked) {
        var workboxes = document.getElementsByClassName("workboxes");
        for (let i = 0; i < workboxes.length; i++) {
            if (workboxes[i].checked)
                units.push(i + 1);
        }
    } else {
        for (let i = 0; i < unitBoxes.length; i++) {
            if (unitBoxes[i].checked)
                units.push(i + 1);
        }
    }
    //console.log(units);
    if (units.length == 0)
        units.push(1);
    //var unit = units[Math.floor(Math.random() * units.length)];
    var ids = [];
    for (let i = 0; i < idBoxes.length; i++) {
        if (idBoxes[i].checked)
            ids.push(i + 1);
    }
    if (ids.length == 0)
        ids.push(1);
    identifier = ids[Math.floor(Math.random() * ids.length)];
    //identifier = Math.floor(Math.random() * (identifiers[0].length - 2)) + 1;
    question.textContent = identifiers[0][identifier] + "?";
    workIndex = Math.floor(Math.random() * (identifiers.length - 1)) + 1;
    let n = 0;
    let unitIDlistIndex = identifiers[0].length - 1;

    while ((!((allWorks.checked && contains(units, workIndex * 1)) || (!allWorks.checked && contains(units, identifiers[workIndex][unitIDlistIndex] * 1))) || identifiers[workIndex][1] === "") && n < 100 && identifiers[workIndex][identifier] !== "") {
        workIndex = Math.floor(Math.random() * (identifiers.length - 1)) + 1;
        n++;
    }
    //console.log(identifiers[workIndex][1]==="");
    // console.log(identifiers[workIndex][unitIDlistIndex]);
    // console.log((contains(units, identifiers[workIndex][unitIDlistIndex]*1)));
    // special cases
    if (workIndex == 20 && identifiers[0][identifier] === "Date") {
        subtype = Math.floor(Math.random() * 2)
        question.textContent = question.textContent + (subtype == 0 ? " (temple)" : " (hall)");
    }
    let path = identifiers[workIndex][0].split("/");
    work.src = "/assets/arthist/artimages/" + path[Math.floor(Math.random() * path.length)];
}
function equals(one, two) {
    if (strict.checked)
        return one === two;
    if (one === two)
        return true;
    if (identifiers[0][identifier] === "Date") {
        one = one.trim();
        var dateIsBCE = two.trim().substring(two.length - 3).toLowerCase() === "bce";
        // console.log(dateIsBCE);
        if ((one.substring(one.length - 3).toLowerCase() === "bce" || one.substring(0, 1) === "-") == (dateIsBCE)) {
            if (two.substring(5, 8) === "BCE") {
                var rangeBwBCEandCE = one.split("-");
                for (let i = 0; i < rangeBwBCEandCE.length; i++) {
                    rangeBwBCEandCE[i] = rangeBwBCEandCE[i].trim();
                    if (rangeBwBCEandCE[i].substring(rangeBwBCEandCE[i].length - 3).toLowerCase() === "bce")
                        rangeBwBCEandCE[i] = rangeBwBCEandCE[i].substring(0, rangeBwBCEandCE[i].length - 3).trim() * -1;
                    if (rangeBwBCEandCE[i].substring(rangeBwBCEandCE[i].length - 2).toLowerCase() === "ce")
                        rangeBwBCEandCE[i] = rangeBwBCEandCE[i].substring(0, rangeBwBCEandCE[i].length - 2).trim() * 1;
                }
                betweenRange(rangeBwBCEandCE, [-600, 150], range.checked);
            }
            if (dateIsBCE) {
                if (one.substring(0, 1) === "-")
                    one = one.substring(1);
                if (one.substring(one.length - 3).toLowerCase() === "bce")
                    one = one.substring(0, one.length - 3).trim();
                two = two.substring(0, two.length - 3).trim();
                // console.log(one+" "+two);
            }
            return betweenRange(one.split('-'), two.split('-'), range.checked);

        }
        else
            return false;
    }
    //fuzzyEquals(one.split(","), two.split(","))
    return one === two;
}
function betweenRange(ones, twos, inmiddle) {

    for (let i = 0; i < Math.max(ones.length, twos.length); i++) {
        if (i < ones.length)
            ones[i] = ones[i].trim() * 1;
        if (i < twos.length)
            twos[i] = twos[i].trim() * 1;
    }
    ones.sort();
    twos.sort();
    // console.log(ones + " " + twos);
    if (inmiddle && twos.length == 2)
        return ones[0] <= twos[1] && ones[0] >= twos[0] && ((ones.length == 1) || (ones[1] <= twos[1] && ones[1] >= twos[0]));
    return ones[0] == twos[0] && ((ones.length == 1) || ones[1] == twos[1]);
}
function contains(arr, val) {
    var bool = false;
    arr.forEach(element => {
        if (element === val)
            bool = true;
    });
    return bool;
}
function process(event) {
    // console.log(event.key);
    if (event.key === "Enter")
        check();
}
function showAllWorks() {
    var workDivs = document.getElementsByClassName("workDivs");
    if (workDivs.length >= 4) {
        for (let i = 0; i < workDivs.length; i++)
            workDivs[i].className = "workDivs" + (allWorks.checked ? "" : " hide");
        return;
    }
    var lengthOfIdentifiers = identifiers[0].length;
    for (let i = 1; i < identifiers.length; i++) {
        if (identifiers[i][1] !== "") {
            let tempDiv = document.createElement("div");
            tempDiv.className = "workDivs";
            let tempUnit = identifiers[i][lengthOfIdentifiers - 1] - 1;
            tempDiv.innerHTML = "<label><input type=\"checkbox\" class = \"workboxes\"" + (unitBoxes[tempUnit].checked ? " checked" : "") + "> " + identifiers[i][1] + " </label>";
            unitDivs[tempUnit].appendChild(tempDiv);
        }

    }
}
function update() {
    var workDivs = document.getElementsByClassName("workDivs");
    for (let i = 0; i < workDivs.length; i++)
        workDivs[i].children[0].children[0].checked = unitBoxes[identifiers[i + 1][identifiers[0].length - 1] - 1].checked;
}
function fuzzyEquals(ones, twos) {
    for (let i = 0; i < ones.length; i++) {
        for (let j = 0; j < twos.length; j++) {
            let n = 0;
            let sumOfSpans = 0;
            let len = 0;
            while (n < ones[i].length) {
                while (ones[i].substring(n, n + 1) === twos[j].substring(n, n + 1)) {
                    len++;
                    n++;
                }
                if (len > 1)
                    sumOfSpans += len;
                len = 0;
            }
        }
    }

}
