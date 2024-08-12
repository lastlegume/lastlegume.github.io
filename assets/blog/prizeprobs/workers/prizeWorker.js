let prevSettings = [];
let update = true;
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
    } else if(e.data[0] === "verify") {
        update = false;
        verifyData(e.data[1], e.data[2]);
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
        if ((n < 100000 || i % 100 == 0)&&update)
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
        if ((n < 100000 || i % 100 == 0)&&update)
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

async function verifyData(reps, files) {
    // we need to do reps trials ~240*60 times
    let verifyIdx = 0;

        for (let i = 1; i < files.length; i++) {
            let path = files[i];
            let response = await fetch("/assets/blog/prizeprobs/" + path);
            response = await response.text();
            let csv = readCSV(response);
            let error = 0;
            let n = 0;
            for (let r = 1; r < csv.length; r++) {
                let sim = [];
                let copies = csv[r][0].match(/[\d]+/g)[0] * 1;
                let basics = (path.includes("NoBasics")) ? 0 : path.match(/_([\d]+)Basics/)[1] * 1;
                if (path.includes("handProb")) {
                    sim = simulateNHands(copies, basics, reps, path.includes("B_"))[1];
                } else {
                    sim = simulateNSetups(copies, basics, reps, path.includes("B_"));
                }
                sim = sim.map((e) => e / reps);
                for (let c = 0; c < sim.length; c++) {
                    error += Math.abs(sim[c] - csv[r][c + 1]);
                    n++;
                }
            }

            verifyIdx++;

            error /= n;
            postMessage([verifyIdx, error, path.split("/")[1]]);
        }
        postMessage(["done"]);
}

function readCSV(text) {
    csv = text.split("\n");
    csv.pop(csv.length - 1);
    for (let i = 0; i < csv.length; i++) {
        var string = csv[i].replaceAll("\r", "");
        if (string.substring(string.length - 1) === ",")
            string = string.substring(0, string.length - 1);
        csv[i] = [];
        var start = 0;
        for (let j = 0; j < string.length; j++) {
            if (string.substring(j, j + 1) === ",") {
                csv[i].push(string.substring(start, j));
                start = j + 1;
                while (string.substring(j + 1, j + 2) === "\"") {
                    start = j + 2;
                    j += 2;
                    while (j < string.length && (string.substring(j, j + 1) !== "\"" || string.substring(j + 1, j + 2) !== ","))
                        j++;
                    j++;
                    csv[i].push(string.substring(start, j - 1).replaceAll('"', ''));
                    start = j + 1;
                }
            }
        }
        csv[i].push(string.substring(start));
    }

    //console.log(csv);
    return csv;
}