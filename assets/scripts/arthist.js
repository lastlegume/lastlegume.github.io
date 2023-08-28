const checkButton = document.getElementById("checkIdentifier");
checkButton.addEventListener('click', () => check());

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
const weights = [.04, .15, .21, .21, .06, .06, .04, .08, .04, .11];

const request = new XMLHttpRequest();
request.addEventListener('load', readCSV);
request.open("GET", "https://lastlegume.github.io/assets/arthist/arthistidentifiers.csv");
request.send();

function check() {
    if (equals(answer.value.toLowerCase().trim(), identifiers[workIndex][identifier].toLowerCase().trim())){
        reply.textContent = "Correct! The " + identifiers[0][identifier].toLowerCase() + " of " + identifiers[workIndex][1] + " is " + identifiers[workIndex][identifier] + ".";
        reply.style.setProperty('background-color', 'darkseagreen');
    }
    else{
        reply.textContent = "Incorrect. The " + identifiers[0][identifier].toLowerCase() + " of " + identifiers[workIndex][1] + " is " + identifiers[workIndex][identifier] + ".";
        reply.style.setProperty('background-color', 'crimson');
    }

    makeQuestion();
}
function readCSV() {
    identifiers = this.responseText.split("\n");
    identifiers.pop(identifiers.length - 1);
    for (let i = 0; i < identifiers.length; i++) {
        var string = identifiers[i]; 
        identifiers[i] = [];
        var start = 0;
        for(let j = 0;j<string.length;j++){
            if(string.substring(j,j+1)===","){
                identifiers[i].push(string.substring(start, j));
                start = j+1;
                while(string.substring(j+1, j+2)==="\""){
                    start = j+2;
                    j+=2;
                    while(string.substring(j, j+1)!=="\""||string.substring(j+1, j+2)!==",")
                        j++;
                    j++;
                    identifiers[i].push(string.substring(start, j-1));
                    start = j+1;
                }
            }
        }
    }
    makeQuestion();

    //  console.log(identifiers);

}
function makeQuestion() {
    answer.value="";
    //make checkboxes of class period and then iterate through with for loop. for each that is true, add i+1 to the list
    var units = [];
    //unitBoxes.length
    for (let i = 0; i < 1; i++) {
        if (unitBoxes[i].checked)
            units.push(i + 1);
    }
    //pick a random period
    if (units.length == 0)
        units.push(1);
    var unit = Math.floor(Math.random() * units.length);
    //does nothing right now, will be added once more than one unit is in the system
    identifier = Math.floor(Math.random() * (identifiers[0].length - 2)) + 1;
    question.textContent = identifiers[0][identifier] + "?";
    workIndex = Math.floor(Math.random() * (identifiers.length - 1)) + 1
    work.src = "https://lastlegume.github.io/assets/arthist/artimages/" + identifiers[workIndex][0];

}
function equals(one, two){
    if(strict.checked)
        return one===two;
    if(identifier==3){
        if(two.split("-").length==1)
            return one===two;

        if(one.substring(0,1)==="-")
            one = one.substring(1).trim()+" bce";
        if(!range.checked||one.split("-").length==2){
            return one===two;
        }
        var dateLimits = two.split("-");
        var ce = true;
        if(dateLimits[1].substring(dateLimits[1].length-3).trim().toLowerCase()==="bce"){
            dateLimits[1] = dateLimits[1].trim().substring(0, dateLimits[1].length-3);  
            ce = false;
        }
        return (dateLimits[0]<=one&&one<=dateLimits[1])&&(ce||one.trim().substring(one.length-3).toLowerCase()==="bce");
    
    }
    return one===two;
}
