// html elements
const searchBar = document.getElementById("searchBar");
const resultsTable = document.getElementById("resultsTable");
const resultsBody = document.getElementById("resultsBody");
const gameFilters = document.getElementById("gameFilters");
const languageFilters = document.getElementById("languageFilters");

// global variables
let dex = [];
let str = "";
let numberOfResults = 100;
let filtered = [];

toggleDisabledBar();

searchBar.addEventListener('input', search);

fetch("/assets/dex-search/dex.csv").then((response) => {
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

    let row;
    for (let r = 0; r < Math.min(csv.length, numberOfResults); r++) {
        row = document.createElement("tr");
        for (let c = 0; c < csv[r].length; c++) {
            let td = document.createElement("td");
            td.innerText = csv[r][c].replaceAll('"', '');
            td.classList.add("x-small");
            row.appendChild(td);
        }
        resultsBody.appendChild(row);
    }

}

function search(){
    toggleDisabledBar();
    let query = searchBar.value;
    console.log(query);
    let results = [];
    for(let i = 0;i<filtered.length;i++){
        if(filtered[i][0].includes(query) || filtered[i][3].includes(query))
            results.push(filtered[i]);
    }
    fillTable(results);
    toggleDisabledBar();
}

function createFilters(data){
    let languages = [];
    let games = [];
    for(let i = 0;i<data.length;i++){
        if(!games.includes(data[i][1]))
            games.push(data[i][1]);
        if(!languages.includes(data[i][2]))
            languages.push(data[i][2]);
    }
    for(let i = 0;i<games.length;i++){
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
    for(let i = 0;i<languages.length;i++){
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

function filter(){
    toggleDisabledBar();
    filtered = [];
    //first element is list of game filters, second is list of language filters
    let filters = [[],[]];

    let gameFilters = document.getElementsByClassName("gameFilter");
    for(let i = 0;i<gameFilters.length;i++){
        if(gameFilters[i].children[0].checked)
            filters[0].push(gameFilters[i].children[1].innerText);
    }
    let languageFilters = document.getElementsByClassName("languageFilter");
    for(let i = 0;i<languageFilters.length;i++){
        if(languageFilters[i].children[0].checked)
            filters[1].push(languageFilters[i].children[1].innerText);
    }

    for(let i = 0;i<dex.length;i++){
        if(filters[0].includes(dex[i][1]) && filters[1].includes(dex[i][2]))
            filtered.push(dex[i]);
    }
    toggleDisabledBar();
    search();
}

function toggleDisabledBar(){
    if(searchBar.disabled){
        searchBar.disabled = false;
        searchBar.placeholder = "Start search!";
        searchBar.focus();
    }else{
        searchBar.disabled = true;
        searchBar.placeholder = "loading...";
    }
}