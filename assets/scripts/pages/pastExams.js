
const tableBody = document.getElementById("exams-body")
const path = "assets/tests/"
fetch("/assets/data-sets/past-exams.json").then((r) => r.text().then(addToTable));

function addToTable(response) {
    data = JSON.parse(response);
    let rows = []
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

    for (r of rows)    
        tableBody.appendChild(r);


}

function compareRows(a,b){
    if (a.children[1].innerText<b.children[1].innerText)
        return 1;
    else if (a.children[1].innerText>b.children[1].innerText)
        return -1;
    return 0;

}

function addCellToTable(name, entry, row) {
    let cell = document.createElement("td");
    if(name==="links"){
        let folder = entry["tournament"].toLowerCase()+"/"
        let links = entry["links"];
        let len = links.length
        for(let i = 0;i<len;i++){
            if(i>0)
                cell.appendChild(document.createTextNode(" | "));
            let link = document.createElement('a');
            link.href = path+folder+toPathName(links[i]);
            link.innerText = links[i];
            cell.appendChild(link);
        }
    }else if (name==="notes"){
        if(entry?.cowriters){
            let label = document.createElement("label");
            let span = document.createElement("span");
            span.classList.add("descriptor");
            span.setAttribute("hover-text", entry["cowriters"]);
            span.innerText = "Cowriters";
            label.appendChild(span);
            cell.appendChild(label);
            cell.appendChild(document.createTextNode(" "));
        }
        if(entry["notes"]){
            let label = document.createElement("label");
            let span = document.createElement("span");
            span.classList.add("descriptor");
            span.setAttribute("hover-text", entry["notes"]);
            span.innerText = "Notes";
            label.appendChild(span);
            cell.appendChild(label);
        }

    }else{
        cell.innerText = entry[name];
    }
    cell.classList.add(name);
    row.appendChild(cell);
}

function toPathName(name){
    return (name.toLowerCase().replaceAll(" ", "_"))+".pdf";
}