// html elements
const searchBar = document.getElementById("searchBar");
const resultsTable = document.getElementById("resultsTable");
const resultsBody = document.getElementById("resultsBody");

// global variables
let dex = [];
let str = "";
let numberOfResults = 100;

searchBar.disabled = true;
searchBar.placeholder = "loading...";
searchBar.addEventListener('input', search);

fetch("/assets/dex-search/dex.csv").then((response) => {
    response.text().then((txt) => {
        str = txt;
        dex = readCSV(str);
        searchBar.disabled = false;
        searchBar.placeholder = "Start search!";
        fillTable(dex)

    });
});


function fillTable(csv) {
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
    let query = searchBar.value;
    console.log(query);
    let results = [];
    for(let i = 0;i<dex.length;i++){
        if(dex[i][0].includes(query) || dex[i][3].includes(query))
            results.push(dex[i]);
    }
    fillTable(results);
}