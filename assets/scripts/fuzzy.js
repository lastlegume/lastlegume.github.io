const check = document.getElementById("check");
check.addEventListener('click', () => fuzzyEq())
const exponentialFlag = document.getElementById("exponentialCheck");
exponentialFlag.addEventListener('change', () => changeFlag())
const guessElement = document.getElementById("guess");
const answerElement = document.getElementById("answer");
const reply = document.getElementById("reply");
answerElement.addEventListener("keydown", (e) => process(e));
guessElement.addEventListener("keydown", (e) => process(e));

const leniencyf = document.getElementById("leniencyf");
const fuzzyf = document.getElementById("fuzzyf");
const fuzzyElement = document.getElementById("fuzzy");
const leniencyElement = document.getElementById("leniency");

const fuzzyIndicator = document.getElementById("fuzzyIndicator");
const fuzzyFIndicator = document.getElementById("fuzzyFIndicator");
const leniencyFIndicator = document.getElementById("leniencyFIndicator");
const leniencyIndicator = document.getElementById("leniencyIndicator");

fuzzyFIndicator.textContent = fuzzyf.value;
fuzzyIndicator.textContent = fuzzyElement.value;
leniencyFIndicator.textContent = leniencyf.value;
leniencyIndicator.textContent = leniencyElement.value;

fuzzyf.addEventListener("input", (event) => { fuzzyFIndicator.textContent = event.target.value; });
fuzzyElement.addEventListener("input", (event) => { fuzzyIndicator.textContent = event.target.value; });
leniencyf.addEventListener("input", (event) => { leniencyFIndicator.textContent = event.target.value; });
leniencyElement.addEventListener("input", (event) => { leniencyIndicator.textContent = event.target.value; });

var exponentialFlagValue = 0;

function process(event) {
    if (event.key === "Enter")
        fuzzyEq();
}
function fuzzyEq() {
    console.log("hi");
    if (fuzzy(guessElement.value, answerElement.value)) {
        reply.innerHTML = "The strings <span style = \"color: forestgreen;\">match</span>!";
        reply.style.setProperty('background-color', 'darkseagreen');
    } else {
        reply.innerHTML = "The strings <span style = \"color: lightsalmon;\">do not match.</span>";
        reply.style.setProperty('background-color', 'crimson');
    }
}
function changeFlag() {
    exponentialFlagValue = 1 - exponentialFlagValue;
    var elements = [];
    if (exponentialFlagValue == 1) {
        elements = document.getElementsByClassName("exponential");
        for (let i = 0; i < elements.length; i++)
            elements[i].style.setProperty('display', 'none');
        elements = document.getElementsByClassName("manual");
        for (let i = 0; i < elements.length; i++)
            elements[i].style.setProperty('display', 'inline-block');

    } else {
        elements = document.getElementsByClassName("exponential");
        for (let i = 0; i < elements.length; i++)
            elements[i].style.setProperty('display', 'inline-block');
        elements = document.getElementsByClassName("manual");
        for (let i = 0; i < elements.length; i++)
            elements[i].style.setProperty('display', 'none');

    }
}
function fuzzy(guess, answer) {
    // normalizes the format of the strings (optional)
    guess = guess.toLowerCase().trim();
    answer = answer.toLowerCase().trim();
    // checks if the strings are equals beforehand to skip the iteration if unnecessary
    if (guess === answer)
        return true;
    // variable that holds the number of correct characters
    let score = 0;
    // number of characters back or forwards a substring is allowed to be before being counted as nonexistent.
    var leniencyFactor = 0.5;
    if (exponentialFlag.checked)
        leniencyFactor = leniencyf.value;
    var leniency = Math.ceil(answer.length ** leniencyFactor);
    if (!exponentialFlag.checked)
        leniency = leniencyElement.value;
    // factor that controls the amount that can be wrong
    var fuzzyFactor = -0.45;
    if (exponentialFlag.checked)
        fuzzyFactor = fuzzyf.value;
    var fuzziness = 1 - answer.length ** fuzzyFactor;
    if (!exponentialFlag.checked)
        fuzziness = fuzzyElement.value;
    // maximum possible score (subtracts the length of answer because one character substrings are not being checked)
    var neededFuzzyAmount = ((answer.length) * (answer.length + 1) * (answer.length + 2)) / 6 - answer.length;
    //checks substrings of lengths started at the length of the guess to a length of 2 
    for (let i = guess.length; i >= 2; i--) {
        //moves through the guess string to find all substrings of length i
        for (let s = 0; s <= (guess.length - i); s++) {
            //checks the substrings of guess with equal length substrings in answer from the same index - leniency to the same index + leniency
            for (let a = Math.max(0, s - leniency); a <= Math.min(s + leniency, answer.length - i); a++) {
                // if the substrings are equal, adds the number of correct characters (the length of the substring) to the score
                if (guess.substring(s, s + i) === answer.substring(a, a + i)) {
                    score += i;
                }
            }
            // if a high enough score is reached, it skips the rest of the program
            if (score > neededFuzzyAmount ** fuzziness)
                return true;
        }
    }
    return score > neededFuzzyAmount ** fuzziness;
}