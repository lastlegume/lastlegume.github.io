const checkButton = document.getElementById("checkIdentifier");
checkButton.addEventListener('click', () => check());
const allWorks = document.getElementById("allWorks");
allWorks.addEventListener('change', () => showAllWorks())

var identifiers = [];
var previousWork = 0;

const work = document.getElementById("work");
const question = document.getElementById("question");
const answer = document.getElementById("answer");
var reply = document.getElementById("reply");
var strict = document.getElementById("strict");
var range = document.getElementById("range");
var acceptCaption = document.getElementById("acceptcaption");
var onlyCaption = document.getElementById("onlycaption");

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
var unitIdx = 0;

var extraAnswers = [];

answer.addEventListener("keydown", (e) => process(e));
const request = new XMLHttpRequest();
request.addEventListener('load', readCSV);
request.open("GET", "/assets/arthist/arthistidentifiers.csv");
request.send();
//https://lastlegume.github.io
function check() {
    previousWork = workIndex;
    var correctAnswer = identifiers[workIndex][identifier].trim();
    var nameOfWork = identifiers[workIndex][1];
    //special cases
    let specialCase = isSpecialCase();
    if (specialCase != -1) {
        //        if (Math.round(specialCase) == specialCase) {
        //identifiers[0][identifier] === "Title"
        if (correctAnswer.split(":").length > 1) {
            if (acceptCaption.checked) {
                if (!onlyCaption.checked)
                    extraAnswers.push(correctAnswer.split(":")[0]);
                correctAnswer = correctAnswer.split(":")[1].split("/")[subtype];
            } else {
                correctAnswer = correctAnswer.split(":")[0]
            }
        }
        else if (correctAnswer.split("/").length > 1)
            correctAnswer = correctAnswer.split("/")[subtype];
        //  }
        if (specialCase >= 1000) {
            let overall = nameOfWork.split(":");
            nameOfWork = overall[0] + " (caption: " + overall[1].split("/")[subtype] + ")";
        } else if (specialCase > 0) {
            nameOfWork = nameOfWork.split(":")[0];
        }
        if (specialCase == 1) {
            nameOfWork += (subtype == 0 ? " (temple)" : " (hall)");
        } else if (specialCase == 2) {
            nameOfWork += (subtype == 0 ? " (built)" : " (rebuilt)");
        } else if (specialCase == 3) {
            nameOfWork += (subtype == 0 ? " (building)" : " (roof)");
        } else if (specialCase == 4) {
            nameOfWork += (subtype == 0 ? " (architecture)" : (subtype == 1 ? " (tympanum)" : " (reliquary)"));
        } else if (specialCase == 5) {
            nameOfWork += (subtype == 0 ? " (church)" : " (reliquary)");
        } else if (specialCase == 6) {
            nameOfWork += (subtype == 0 ? " (original construction)" : " (reconstruction)");
        } else if (specialCase == 7) {
            nameOfWork += (subtype == 0 ? " (chapel)" : " (fresco)");
        } else if (specialCase == 8) {
            nameOfWork += (subtype == 0 ? " (ceiling)" : " (altar)");
        } else if (specialCase == 9) {
            nameOfWork += (subtype == 0 ? " (commissioned)" : (subtype == 1 ? " (group of artists)" : " (annotations)"));
        } else if (specialCase == 10) {
            nameOfWork += (subtype == 0 ? " (plan)" : (subtype == 1 ? " (facade)" : " (ceiling fresco)"));
        } else if (specialCase == 11) {
            nameOfWork += (subtype == 0 ? " (church)" : (subtype == 1 ? " (fresco)" : " (fresco and stucco figures)"));
        } else if (specialCase == 12) {
            nameOfWork += (subtype == 0 ? " (sculpture)" : " (chapel)");
        } else if (specialCase == 13) {
            nameOfWork += (subtype == 0 ? " (architecture)" : " (sculpture)");
        }

    }
    let overall = nameOfWork.split(":");
    if(overall.length>1)
        nameOfWork = overall[0] + " (caption: " + overall[1].split("/")[subtype] + ")";
    if (equals(answer.value.toLowerCase().trim(), correctAnswer.toLowerCase())) {
        reply.innerHTML = "Correct! The <span style = \"color: forestgreen;\">" + identifiers[0][identifier].toLowerCase() + "</span> of <span style = \"color: forestgreen;\">" + nameOfWork + "</span> is <span style = \"color: forestgreen;\">" + correctAnswer + "</span>.";
        reply.style.setProperty('background-color', 'darkseagreen');
    }
    else {
        reply.innerHTML = "Incorrect. The <span style = \"color: lightsalmon;\">" + identifiers[0][identifier].toLowerCase() + "</span> of <span style = \"color: lightsalmon;\">" + nameOfWork + "</span> is <span style = \"color: lightsalmon;\">" + correctAnswer + "</span>.";
        reply.style.setProperty('background-color', 'crimson');
    }

    makeQuestion();
}
function readCSV() {
    identifiers = this.responseText.split("\n");
    identifiers.pop(identifiers.length - 1);
    for (let i = 0; i < identifiers.length; i++) {
        var string = identifiers[i].replaceAll("\r", "");
        if (string.substring(string.length - 1) === ",")
            string = string.substring(0, string.length - 1);
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
                    while (j < string.length && (string.substring(j, j + 1) !== "\"" || string.substring(j + 1, j + 2) !== ","))
                        j++;
                    j++;
                    identifiers[i].push(string.substring(start, j - 1));
                    start = j + 1;
                }
            }
        }
        identifiers[i].push(string.substring(start));
    }
    for (let i = 0; i < identifiers[0].length; i++)
        unitIdx += (identifiers[0][i] === "Unit" ? 1 : 0) * i;
    makeQuestion();

    //  console.log(identifiers);

}
function makeQuestion() {
    answer.value = "";
    //make checkboxes of class period and then iterate through with for loop. for each that is true, add i+1 to the list
    var units = [];
    extraAnswers = [];

    if (allWorks.checked) {
        var workDivs = document.getElementsByClassName("workDivs");
        var workboxes = document.getElementsByClassName("workboxes");
        for (let i = 0; i < workboxes.length; i++) {
            if (workboxes[i].checked) {
                let idxOf = indexOfIdentifier(workDivs[i].innerText.trim(), "Title");
                // console.log(workDivs[i].innerText.trim());
                // console.log(idxOf);
                if (idxOf == -1)
                    units.push(i + 1);
                else
                    units.push(idxOf);
            }
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
    if (allWorks.checked && units.length == 1) {
        workIndex = units[0];
        previousWork = -1;
        n = 10000000000;
    }
    if (allWorks.checked) {
        workIndex = units[Math.floor(Math.random() * (units.length))];
        while (((workIndex == previousWork && n < 100) || identifiers[workIndex][identifier] === "") && n < 10000) {
            workIndex = units[Math.floor(Math.random() * (units.length))];
            n++;
        }
    } else {
        //if the stuff in the parenthesis with OR is true, we need to continue searching
        while ((!((allWorks.checked && contains(units, workIndex * 1)) || (!allWorks.checked && contains(units, identifiers[workIndex][unitIDlistIndex] * 1))) || identifiers[workIndex][1] === "" || identifiers[workIndex][identifier] === "" || workIndex > 250 || workIndex == previousWork) && n < 10000) {
            workIndex = Math.floor(Math.random() * (identifiers.length - 1)) + 1;
            n++;
        }
    }
    console.log(units);

    if (identifiers[workIndex][identifier] === "")
        workIndex = units[0];
    if (!contains(units, identifiers[workIndex][unitIDlistIndex] * 1) && !allWorks.checked)
        workIndex = 1;
    console.log("work: " + workIndex + ", identifier: " + identifier + ", subtype: " + subtype);
    // console.log(identifiers[workIndex]);
    // console.log(identifiers[workIndex][1]==="");
    //  console.log(identifiers[workIndex][unitIDlistIndex]);
    // console.log((contains(units, identifiers[workIndex][unitIDlistIndex]*1)));
    subtype = 0;
    let path = identifiers[workIndex][0].split("/");
    var imgIndex = Math.floor(Math.random() * path.length);
    // special cases
    let specialCase = isSpecialCase();
    // console.log(specialCase);
    if (specialCase > 0) {
        if (specialCase == 1) {
            subtype = Math.floor(Math.random() * 2);
            question.textContent = question.textContent + (subtype == 0 ? " (temple)" : " (hall)");
        } else if (specialCase == 2) {
            subtype = Math.floor(Math.random() * 2);
            question.textContent = question.textContent + (subtype == 0 ? " (built)" : " (rebuilt)");
        } else if (specialCase == 3) {
            subtype = Math.floor(Math.random() * 2);
            question.textContent = question.textContent + (subtype == 0 ? " (building)" : " (roof)");
        } else if (specialCase == 4) {
            subtype = Math.floor(Math.random() * 3);
            question.textContent = question.textContent + (subtype == 0 ? " (architecture)" : (subtype == 1 ? " (tympanum)" : " (reliquary)"));
        } else if (specialCase == 5) {
            subtype = Math.floor(Math.random() * 2);
            question.textContent = question.textContent + (subtype == 0 ? " (church)" : " (reliquary)");
        } else if (specialCase == 6) {
            subtype = Math.floor(Math.random() * 2);
            question.textContent = question.textContent + (subtype == 0 ? " (original construction)" : " (reconstruction)");
        } else if (specialCase == 7) {
            subtype = Math.floor(Math.random() * 2);
            question.textContent = question.textContent + (subtype == 0 ? " (chapel)" : " (fresco)");
        } else if (specialCase == 8) {
            subtype = Math.floor(Math.random() * 2);
            question.textContent = question.textContent + (subtype == 0 ? " (ceiling)" : " (altar)");
        } else if (specialCase == 9) {
            subtype = Math.floor(Math.random() * 3);
            question.textContent = question.textContent + (subtype == 0 ? " (commissioned)" : (subtype == 1 ? " (group of artists)" : " (annotations)"));
        } else if (specialCase == 10) {
            subtype = Math.floor(Math.random() * 3);
            question.textContent = question.textContent + (subtype == 0 ? " (plan)" : (subtype == 1 ? " (facade)" : " (ceiling fresco)"));
        } else if (specialCase == 11) {
            subtype = Math.floor(Math.random() * 3);
            question.textContent = question.textContent + (subtype == 0 ? " (church)" : (subtype == 1 ? " (fresco)" : " (fresco and stucco figures)"));
        } else if (specialCase == 12) {
            subtype = Math.floor(Math.random() * 2);
            question.textContent = question.textContent + (subtype == 0 ? " (sculpture)" : " (chapel)");
        } else if (specialCase == 13) {
            subtype = Math.floor(Math.random() * 2);
            question.textContent = question.textContent + (subtype == 0 ? " (architecture)" : " (sculpture)");
        } else if (specialCase >= 1000) {
            subtype = imgIndex;
        }
    }
    work.src = "/assets/arthist/artimages/" + path[imgIndex];
}
function equals(one, two) {
    if (strict.checked)
        return one === two;
    if (one === two)
        return true;
    if (identifiers[0][identifier] === "Date") {
        one = one.trim();
        if (two.substring(4, 7).toUpperCase() === "BCE") {
            var stillLooking = true;
            for (let i = 1; i < one.length && stillLooking; i++) {
                if (one.substring(i, i + 1) === "-") {
                    stillLooking = false;
                    one = one.substring(0, i) + "/" + one.substring(i + 1);
                }
            }
            var rangeBwBCEandCE = one.split("/");

            for (let i = 0; i < rangeBwBCEandCE.length; i++) {
                rangeBwBCEandCE[i] = rangeBwBCEandCE[i].trim();
                if (rangeBwBCEandCE[i].substring(rangeBwBCEandCE[i].length - 3).toLowerCase() === "bce")
                    rangeBwBCEandCE[i] = '-' + rangeBwBCEandCE[i].substring(0, rangeBwBCEandCE[i].length - 3).trim();
                if (rangeBwBCEandCE[i].substring(rangeBwBCEandCE[i].length - 2).toLowerCase() === "ce")
                    rangeBwBCEandCE[i] = rangeBwBCEandCE[i].substring(0, rangeBwBCEandCE[i].length - 2).trim();
            }
            return betweenRange(rangeBwBCEandCE, ['-600', '150'], range.checked);
        }
        var dateIsBCE = two.trim().substring(two.length - 3).toLowerCase() === "bce";
        // console.log(dateIsBCE);
        if ((one.substring(one.length - 3).toLowerCase() === "bce" || one.substring(0, 1) === "-") == (dateIsBCE)) {
            if (dateIsBCE) {
                if (one.substring(0, 1) === "-")
                    one = one.substring(1);
                if (one.substring(one.length - 3).toLowerCase() === "bce")
                    one = one.substring(0, one.length - 3).trim();
                two = two.substring(0, two.length - 3).trim();
                // console.log(one+" "+two);
            } else {
                two = two.trim().substring(0, two.length - 2).trim();
                if (one.trim().substring(one.length - 2).toLowerCase() == "ce")
                    one = one.trim().substring(0, one.length - 2).trim();
            }
            return betweenRange(one.split('-'), two.split('-'), range.checked);

        }
        else
            return false;
    }
    var ones = [];
    var twos = [];
    if (identifiers[0][identifier] === "Materials" || identifiers[0][identifier] === "Culture") {
        ones = one.split(",");
        twos = two.split(",");
    }

    ones.push(one);
    twos.push(two);
    return fuzzyEquals(ones, twos)
    //return one === two;
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

    for (let i = 1; i < identifiers.length; i++) {
        if (identifiers[i][1] !== "" && identifiers[i][unitIdx] > 0) {
            let tempDiv = document.createElement("div");
            tempDiv.className = "workDivs";
            let tempUnit = identifiers[i][unitIdx] - 1;
            tempDiv.innerHTML = "<label><input type=\"checkbox\" class = \"workboxes\"" + (unitBoxes[tempUnit].checked && i <= 250 ? " checked" : "") + "> " + identifiers[i][1].split(":")[0] + " </label>";
            unitDivs[tempUnit].appendChild(tempDiv);
        }

    }
}
function update() {
    var workDivs = document.getElementsByClassName("workDivs");
    for (let i = 0; i < workDivs.length; i++) {
        var idxOfWorkOfDiv = indexOfIdentifier(workDivs[i].innerText.trim(), "Title");
        if (idxOfWorkOfDiv <= 250)
            workDivs[i].children[0].children[0].checked = unitBoxes[identifiers[idxOfWorkOfDiv][unitIdx] - 1].checked;
    }
}
function fuzzyEquals(ones, twos) {
    twos.push.apply(extraAnswers);
    for (let i = 0; i < ones.length; i++) {
        for (let j = 0; j < twos.length; j++) {
            if (fuzzy(ones[i], twos[j]) || fuzzy(ones[i].replaceAll(/\([.]*?\)/g), twos[j].replaceAll(/\([.]*?\)/g)))
                return true;
        }
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
    console.log(score + " vs needed " + neededFuzzyAmount ** fuzziness)
    return score > neededFuzzyAmount ** fuzziness;
}

function isSpecialCase() {
    // const specialNameCases = [21, 35, 31, 45, 48, 50, 51, 55, 64, 65];
    if (workIndex == 20 && identifiers[0][identifier] === "Date")
        return 1;
    if (workIndex == 39 && identifiers[0][identifier] === "Date")
        return 2;
    if (workIndex == 49 && identifiers[0][identifier] === "Materials")
        return 3;
    if (workIndex == 58 && identifiers[0][identifier] === "Materials")
        return 4;
    if (workIndex == 58 && identifiers[0][identifier] === "Date")
        return 5;
    if (workIndex == 60 && identifiers[0][identifier] === "Date")
        return 6;
    if (workIndex == 63 && identifiers[0][identifier] === "Date")
        return 7;
    if (workIndex == 75 && identifiers[0][identifier] === "Date")
        return 8;
    if (workIndex == 81 && identifiers[0][identifier] === "Name of Author")
        return 9;
    if (workIndex == 82 && identifiers[0][identifier] === "Name of Author")
        return 10;
    if (workIndex == 82 && identifiers[0][identifier] === "Date")
        return 11;
    if (workIndex == 89 && identifiers[0][identifier] === "Materials")
        return 12;
    if (workIndex == 93 && identifiers[0][identifier] === "Materials")
        return 13;

    if (identifiers[workIndex][1].split("/").length > 1) {
        if (identifiers[workIndex][identifier].split("/").length > 1)
            return 1000;
        else
            return 1000.1;
    }
    //to add a new special case of this type (multiple names and multiple answers for some identifiers), add to the number to specialNameCases and create a new if in the same format as the ones below
    // if (workIndex == 21 && (identifiers[0][identifier] === "Title" || identifiers[0][identifier] === "Materials"))
    //     return 1000;
    // else if (workIndex == 31 && (identifiers[0][identifier] === "Title" || identifiers[0][identifier] === "Materials"))
    //     return 1000;
    // else if (workIndex == 35 && (identifiers[0][identifier] === "Title" || identifiers[0][identifier] === "Name of Author"))
    //     return 1000;
    // else if (workIndex == 45 && (identifiers[0][identifier] === "Title" || identifiers[0][identifier] === "Materials" || identifiers[0][identifier] === "Date"))
    //     return 1000;
    // else if ((contains([48, 50, 51, 55, 64, 65], workIndex)) && (identifiers[0][identifier] === "Title"))
    //     return 1000;
    // if (contains(specialNameCases, workIndex))
    //     return 1000.1;
    return -1;
}
function indexOfIdentifier(name, id) {
    var idIdx = 0;
    for (let i = 0; i < identifiers[0].length; i++) {
        if (identifiers[0][i] === id)
            idIdx = i;
    }
    for (let i = 0; i < identifiers.length; i++) {
        if (identifiers[i][idIdx].trim().split(":")[0] === name)
            return i;
    }
    return -1;
}