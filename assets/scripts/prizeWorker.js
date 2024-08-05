let prevSettings = [];
onmessage = (e) => {
    if (e.data[0] === "one") {
        postMessage([e.data[1], ...simulateNSetups(1, 0, e.data[1], false)]);
    } else if (e.data[0] === "any") {
        prevSettings = e.data.slice(1)
        let results = [];
        if (prevSettings[3] === "binhand")
            results = simulateNHands(prevSettings[1] * 1, prevSettings[2] * 1, prevSettings[0], prevSettings[4])[0];
        else if (prevSettings[3] === "tinhand")
            results = simulateNHands(prevSettings[1] * 1, prevSettings[2] * 1, prevSettings[0], prevSettings[4])[1];
        else
            results = simulateNSetups(prevSettings[1] * 1, prevSettings[2] * 1, prevSettings[0], prevSettings[4]);
        postMessage([prevSettings[0], ...results]);
    }
}



function simulateNSetups(copies, basics, n, isCardBasic) {
    let deck = createDeck(copies, basics);//-(copies*isCardBasic?1:0)
    let freqs = Array(7).fill(0);
    let mulligans = 0;
    for (let i = 0; i < n; i++) {
        let tempDeck = shuffle(deck);
        while ((basics != 0 || isCardBasic) && !(tempDeck.slice(0, 7).includes("B") || (tempDeck.slice(0, 7).includes("C") && isCardBasic))) {
            tempDeck = shuffle(deck);
            mulligans++;
        }
        freqs[tempDeck.slice(7, 13).map((val) => (val === "C") ? 1 : 0).reduce((prev, cur) => prev + cur)]++;
        if (n < 100000 || i % 100 == 0)
            postMessage([i, ...freqs]);
    }

    return freqs;
}
function simulateNHands(copies, basics, n, isCardBasic) {
    let deck = createDeck(copies, basics);//-(copies*isCardBasic?1:0)
    let freqs = [Array(8).fill(0), Array(Math.min(copies + 1, 8)).fill(0)];
    let mulligans = 0;
    for (let i = 0; i < n; i++) {
        let tempDeck = shuffle(deck);
        while ((basics != 0 || isCardBasic) && !(tempDeck.slice(0, 7).includes("B") || (tempDeck.slice(0, 7).includes("C") && isCardBasic))) {
            tempDeck = shuffle(deck);
            mulligans++;
        }
        freqs[0][tempDeck.slice(0, 7).map((val) => (val === "B" || val === "C") ? 1 : 0).reduce((prev, cur) => prev + cur)]++;
        freqs[1][tempDeck.slice(0, 7).map((val) => (val === "C") ? 1 : 0).reduce((prev, cur) => prev + cur)]++;
        if (n < 100000 || i % 100 == 0)
            postMessage([i, ...freqs[prevSettings[3] === "binhand" ? 0 : 1]]);
    }
    //0 is basics, 1 is prizes
    return freqs;
}
function createDeck(copies, basics) {
    return [...Array(60 - copies - basics).fill('0'), ...Array(copies).fill('C'), ...Array(basics).fill('B')];
}

function shuffle(deck) {
    for (let i = deck.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    return deck;
}