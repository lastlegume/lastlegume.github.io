
const tableBody = document.getElementById("exams-body")
const tournamentSelect = document.getElementById("tournament")
const seasonSelect = document.getElementById("season")
const eventSelect = document.getElementById("event")

tournamentSelect.addEventListener("change", filter);
seasonSelect.addEventListener("change", filter);
eventSelect.addEventListener("change", filter);

const path = "assets/tests/"
fetch("/assets/data-sets/past-exams.json").then((r) => r.text().then(addToTable));
const rows = []

function addToTable(response) {
    data = JSON.parse(response);

    populateSelect(data);

    for (entry of data["tournaments"]) {
        let row = document.createElement("tr");
        addCellToTable("tournament", entry, row);
        addCellToTable("season", entry, row);
        addCellToTable("event", entry, row);
        addCellToTable("links", entry, row);
        addCellToTable("notes", entry, row);
        rows.push(row);
    }

    rows.sort(compareRows);
    filter();

    for (r of rows)
        tableBody.appendChild(r);

}

function compareRows(a, b) {
    if (a.children[1].innerText < b.children[1].innerText)
        return 1;
    else if (a.children[1].innerText > b.children[1].innerText)
        return -1;
    return 0;

}

function addCellToTable(name, entry, row) {
    let cell = document.createElement("td");
    if (name === "links") {
        let folder = toPathName(entry["tournament"]) + (entry["season"].substring(entry["season"].length - 2)) + "_" + toFirstLetters(entry["event"]) + "/"
        let links = entry["links"];
        let len = links.length
        for (let i = 0; i < len; i++) {
            if (i > 0)
                cell.appendChild(document.createTextNode(" | "));
            let link = document.createElement('a');
            link.href = path + folder + toPathName(links[i]) + ".pdf";
            link.innerText = links[i];
            cell.appendChild(link);
        }
    } else if (name === "notes") {
        if (entry?.cowriters) {
            let label = document.createElement("label");
            let span = document.createElement("span");
            span.classList.add("descriptor");
            span.setAttribute("hover-text", entry["cowriters"]);
            span.innerText = "Cowriters";
            label.appendChild(span);
            cell.appendChild(label);
            cell.appendChild(document.createTextNode(" "));
        }
        if (entry["notes"]) {
            let label = document.createElement("label");
            let span = document.createElement("span");
            span.classList.add("descriptor");
            span.setAttribute("hover-text", entry["notes"]);
            span.innerText = "Notes";
            label.appendChild(span);
            cell.appendChild(label);
        }

    } else {
        cell.innerText = entry[name];
    }
    cell.classList.add(name);
    row.appendChild(cell);
}

function toPathName(name) {
    return (name.toLowerCase().replaceAll(" ", "_"));
}

function toFirstLetters(name) {
    return name.toLowerCase().split(" ").map((s) => s.substring(0, 1)).join("");
}

function populateSelect(data) {
    let tournament = [...new Set(data["tournaments"].map((e) => e["tournament"]))]
    let season = [...new Set(data["tournaments"].map((e) => e["season"]))]
    let events = [...new Set(data["tournaments"].map((e) => e["event"]))]
    for (t of tournament) {
        tournamentSelect.appendChild(createOption(t));
    }
    for (s of season) {
        seasonSelect.appendChild(createOption(s));
    }
    for (e of events) {
        eventSelect.appendChild(createOption(e));
    }
}

function createOption(text) {
    let option = document.createElement("option");
    option.value = text;
    option.innerText = text;
    option.selected = true;
    return option;
}

function filter() {
    let events = Array.from(eventSelect.selectedOptions).map((e) => e.innerText);
    let tournaments = Array.from(tournamentSelect.selectedOptions).map((e) => e.innerText);
    let seasons = Array.from(seasonSelect.selectedOptions).map((e) => e.innerText);

    for (r of rows) {
        console.log(r.children[0].innerText);
        if (tournaments.includes(r.children[0].innerText) && seasons.includes(r.children[1].innerText) && events.includes(r.children[2].innerText))
            r.style.display = "";
        else
            r.style.display = "none";
    }
}