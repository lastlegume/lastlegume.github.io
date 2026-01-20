// html elements
const searchBar = document.getElementById("searchBar");
const resultsTable = document.getElementById("resultsTable");
const resultsBody = document.getElementById("resultsBody");
const gameFilters = document.getElementById("gameFilters");
const languageFilters = document.getElementById("languageFilters");
const numResults = document.getElementById("numResults");

// global variables
let dex = [];
let str = "";
let numberOfResults = 100;
let filtered = [];

toggleDisabledBar();

searchBar.addEventListener('change', search);
numResults.addEventListener('change', search);
let toggleButtons = document.getElementsByClassName("toggleFilters");
for (let i = 0; i < toggleButtons.length; i++) {
    toggleButtons[i].addEventListener('click', toggle);
}

// with hindsight, why didn't I just use a json file for this? 
// I made the csv with a python script so it would have been easy to just create a json instead
fetch("/assets/data-sets/dex.csv").then((response) => {
    response.text().then((txt) => {
        str = txt;
        dex = readCSV(str);
        createFilters(dex);
        filtered = dex;

        toggleDisabledBar();

        fillTable(dex);
    });
});


function fillTable(csv) {
    // adds rows to the table
    resultsBody.innerHTML = "";
    try {
        numberOfResults = parseInt(numResults.value);
        numberOfResults = Math.max(1, numberOfResults);
    } catch {
        numberOfResults = 100;
    }


    let row;
    for (let r = 0; r < Math.min(csv.length, numberOfResults); r++) {
        row = document.createElement("tr");
        for (let c = 0; c < csv[r].length; c++) {
            let td = document.createElement("td");
            td.innerText = csv[r][c].replaceAll('"', '');
            // td.classList.add("x-small");
            row.appendChild(td);
        }
        resultsBody.appendChild(row);
    }

}

function search() {
    toggleDisabledBar();
    let queryText = searchBar.value.toLowerCase();
    let query = queryText.split(" ");
    let results = [];
    // bag of words search
    // for each entry
    for (let i = 0; i < filtered.length; i++) {
        let score = 1;
        //number of different words from the query found in the entry
        let numQueriesFound = 0;
        //bonus if the exact phrase is found
        if (filtered[i][3].toLowerCase().includes(queryText))
            score += 100;
        //check how many times each query term appears in the entry (with the name included)
        for (let q of query) {
            //score for just this one query
            let qScore = 1;
            //max edit distance between strings to be considered equal (exclusive)
            let likenessThreshold = Math.max(Math.min(6, q.length / 2), 2);
            let doc = [filtered[i][0].toLowerCase(), ...(filtered[i][3].toLowerCase().split(" "))];
            for (let j = 0; j < doc.length; j++) {
                let lDist = 0;
                if (doc[j] === q)
                    //gives boost to exact matches
                    lDist = -3;
                else if (doc[j].length >= q.length)
                    lDist = levenshteinDistance(q, doc[j].substring(0, q.length));
                else
                    lDist = levenshteinDistance(q, doc[j]);
                if (lDist < likenessThreshold) {
                    qScore += 31 - lDist * (30 / likenessThreshold);
                }
            }
            score *= qScore;
            if (qScore > 1)
                numQueriesFound++;
        }
        //add this to results
        if (score > 30)
            results.push([filtered[i], numQueriesFound, score]);
    }
    //first sort by how many queries found, then by score
    let sorted = results.sort((a, b) => b[1] - a[1]).sort((a, b) => b[2] - a[2]);
    fillTable(sorted.map((e) => e[0]));
    toggleDisabledBar();
}

function createFilters(data) {
    let languages = [];
    let games = [];
    for (let i = 0; i < data.length; i++) {
        if (!games.includes(data[i][1]))
            games.push(data[i][1]);
        if (!languages.includes(data[i][2]))
            languages.push(data[i][2]);
    }
    for (let i = 0; i < games.length; i++) {
        let lab = document.createElement("label");
        lab.classList.add("filter");
        lab.classList.add("gameFilter");
        let box = document.createElement("input");
        let text = document.createElement("span");
        text.innerText = games[i];
        box.type = "checkbox";
        box.checked = true;
        lab.appendChild(box);
        lab.appendChild(text);
        lab.appendChild(document.createElement("br"));
        box.addEventListener('change', filter);
        gameFilters.appendChild(lab);
    }
    for (let i = 0; i < languages.length; i++) {
        let lab = document.createElement("label");
        lab.classList.add("filter");
        lab.classList.add("languageFilter");
        let box = document.createElement("input");
        let text = document.createElement("span");
        text.innerText = languages[i];
        box.type = "checkbox";
        box.checked = true;
        lab.appendChild(box);
        lab.appendChild(text);
        lab.appendChild(document.createElement("br"));
        box.addEventListener('change', filter);
        languageFilters.appendChild(lab);
    }
}

function filter() {
    toggleDisabledBar();
    filtered = [];
    //first element is list of game filters, second is list of language filters
    let filters = [[], []];

    let gameFilters = document.getElementsByClassName("gameFilter");
    for (let i = 0; i < gameFilters.length; i++) {
        if (gameFilters[i].children[0].checked)
            filters[0].push(gameFilters[i].children[1].innerText);
    }
    let languageFilters = document.getElementsByClassName("languageFilter");
    for (let i = 0; i < languageFilters.length; i++) {
        if (languageFilters[i].children[0].checked)
            filters[1].push(languageFilters[i].children[1].innerText);
    }

    for (let i = 0; i < dex.length; i++) {
        if (filters[0].includes(dex[i][1]) && filters[1].includes(dex[i][2]))
            filtered.push(dex[i]);
    }
    toggleDisabledBar();
    search();
}

function toggleDisabledBar() {
    if (searchBar.disabled) {
        searchBar.disabled = false;
        searchBar.placeholder = "Start search!";
        searchBar.focus();
    } else {
        searchBar.disabled = true;
        searchBar.placeholder = "loading...";
    }
}

function toggle(e) {
    let target = e.target;
    console.log(target);
    // console.log(target.nextSibling);
    let select = !target.innerText.includes("Deselect");
    target.innerText = select ? "Deselect all" : "Select all";
    let children = target.parentNode.nextSibling.nextSibling.children;
    console.log(children);
    for (let i = 0; i < children.length; i++) {
        children[i].children[0].checked = select;
    }

}