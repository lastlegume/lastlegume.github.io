let handRes = localStorage.getItem('hand');
let prizeRes = localStorage.getItem('prize');

document.getElementById("add").addEventListener('click', addDeck);
document.getElementById("clearStorage").addEventListener('click', () => clearStorage());

const decks = document.getElementById("decks");
const input = document.getElementById("input");
const deckName = document.getElementById('name');
const deckLists = document.getElementById('deckList');
const exactOutput = document.getElementById("exactOutput");
loadData();

deckLists.addEventListener('change', function () { populate(localStorage.getItem(deckLists.value)); })
let nameCounter = 1;

let basics = 0;


async function addDeck() {
    let opt = document.createElement('option');
    let name = deckName.value;
    let used = localStorage.getItem(name);

    while (used || name.length == 0) {
        name = "Deck" + nameCounter;
        nameCounter++;
        used = localStorage.getItem(name);
    }
    opt.value = name;
    opt.innerText = name;
    localStorage.setItem(name, input.value);
    deckLists.appendChild(opt);


    populate(input.value);

}
function view(e) {
    let cards = document.getElementsByClassName("card");
    for(let i = 0;i<cards.length;i++){
        cards[i].classList.remove("highlight");
    }
    let card = e.target;
    while (!card.className.includes("card")) {
        card = card.parentNode;
    }
    card.classList.add("highlight")
    getExactProbabilities((card.children[2].innerText) * 1, (basics - ((card.children[3].innerText === "Basic") ? ((card.children[2].innerText) * 1) : 0)), (card.children[3].innerText === "Basic"))
}
async function populate(str) {
    basics = 0;
    copies = 0;
    decks.innerHTML = "";
    let deck = document.createElement('div');
    deck.className = "deck";
    let totalSize = 0;
    let deckList = str.split("\n");
    console.log(deckList);
    let currentType = "p";
    for (let i = 0; i < deckList.length; i++) {
        if (deckList[i].length > 0 && deckList[i].split(":").length == 1) {
            let copies = deckList[i].match(/^(\d+)\s/)[1];
            let set = deckList[i].match(/\s([A-Z]{3}\s\d+)\s?$/);
            totalSize += copies.trim() * 1;
            let name = deckList[i].replaceAll(/^[\d]+\s/g, "");
            name = name.replaceAll(/\s[A-Z]{3}\s\d+\s?$/g, "");

            let card = document.createElement("div");
            card.className = "card";
            let cardTitle = document.createElement('h5');
            cardTitle.innerText = name;
            card.appendChild(cardTitle);
            let cardSet = document.createElement('div');
            cardSet.className = "set";

            if (set) {
                cardSet.innerText = set[1];
            }
            card.appendChild(cardSet);

            let cardCopies = document.createElement('div');
            cardCopies.className = "copies";
            cardCopies.innerText = copies;
            let cardType = document.createElement('div');
            cardType.className = "type";
            let type = await ((currentType === "p") ? getStage(name) : currentType);
            cardType.innerText = type;
            if (type === "Basic")
                basics += copies.trim() * 1;
            card.appendChild(cardCopies);
            card.appendChild(cardType);
            card.addEventListener('click', (e) => view(e));
            deck.appendChild(card);
        } else {
            if (deckList[i].includes("Pokémon:"))
                currentType = "p";
            else if (deckList[i].includes("Trainer:"))
                currentType = "Trainer";
            else
                currentType = "Energy";

        }
    }
    if (totalSize == 60)
        decks.appendChild(deck);
    else
        decks.innerText = "Invalid Deck";
}
async function getStage(name) {
    //tag teams
    if (name.includes("&") && name.includes("-GX"))
        return "Basic";
    if (name.includes(" VMAX") || name.includes(" VSTAR"))
        return "Stage 1";
    if (name.trim().includes(" V") || name.includes(" EX") || name.includes("Radiant"))
        return "Basic";

    let response = localStorage.getItem('basic');
    if (!response) {
        response = await fetch("/assets/blog/prizeprobs/evolutionStages.csv");
        response = await response.text();
        localStorage.setItem("basic", response);
    }
    let list = response.split("\n");
    for (let i = 0; i < list.length; i++) {
        row = list[i].split(",");
        if (name.toLowerCase().replaceAll(/[\s-']/g, "").includes(row[1].toLowerCase().replaceAll(/[\s-']/g, "")))
            return row[3];
    }
    return "Unknown: Assumed not to be a basic"
}

async function getExactProbabilities(c, b, isBasic) {
    let prizeText = "";
    let handText = "";
    exactOutput.innerHTML = "";
    let idx = (isBasic) ? ((c) + (b * 4) + 3536) : (c) + ((b - 1) * 60);

    handText = "<h3>Exact Hand Probabilities:</h3>\n" + handRes.split("\n")[idx].split(",").slice(1).map((v, i) => `${i} copies in hand: ${(v * 1).toFixed(10)}`).join("<br>");
    prizeText = "<h3>Exact Prize Probabilities:</h3>\n" + prizeRes.split("\n")[idx].split(",").slice(1).map((v, i) => `${i} copies in prizes: ${(v * 1).toFixed(10)}`).join("<br>");

    let hand = document.createElement('div');
    hand.innerHTML = handText;
    exactOutput.appendChild(hand);

    let prize = document.createElement('div');
    prize.innerHTML = prizeText;
    exactOutput.appendChild(prize);
}

async function loadData() {
    if (!handRes) {
        handRes = await fetch("/assets/blog/prizeprobs/combinedHandProbabilities.csv");
        handRes = await response.text();
        localStorage.setItem("hand", handRes);
    }
    if (!prizeRes) {
        prizeRes = await fetch("/assets/blog/prizeprobs/combinedPrizeProbabilities.csv");
        prizeRes = await response.text();
        localStorage.setItem("prize", prizeRes);
    }
    for (let i = 0; i < localStorage.length; i++) {
        let name = localStorage.key(i);
        if (name != "basic" && name != "hand" && name != "prize") {
            let opt = document.createElement('option');
            opt.value = name;
            opt.innerText = name;
            deckLists.appendChild(opt);
        }
    }

}

function clearStorage() {
    localStorage.clear();
}

