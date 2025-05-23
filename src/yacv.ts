import { Parser, Scanner } from "./parser.js";

const file = document.getElementById('file') as HTMLInputElement;
const csv = document.getElementById('csv') as HTMLTableElement;
const separator = document.getElementById('separator') as HTMLSelectElement;
const btnLoad = document.getElementById('btnLoad') as HTMLButtonElement;

btnLoad.onclick = function () {
    csv.tBodies[0].innerHTML = "";
    if (file.files && file.files.length > 0) {
        var fileUrl = file.files[0];
        const reader = new FileReader();
        reader.addEventListener('load', fileLoaded);
        reader.readAsText(fileUrl);
    }
}

function fileLoaded(event: ProgressEvent<FileReader>) {
    try {
        if (!event.target || !event.target.result) {
            throw new Error("File not found");
        }
        var scanner = new Scanner(event.target.result as string, separator.value);
        var tokens = scanner.ScanTokens();
        var parser = new Parser(tokens);
        var result = parser.Parse();
        buildTable(result);
    }
    catch (error) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        if (error instanceof Error) {
            td.innerHTML = error.message;
        }
        else {
            td.innerHTML = "Unknown error";
        }
        tr.appendChild(td);
        tr.classList.add('has-background-danger');
        csv.tBodies[0].appendChild(tr);
    }
}

function buildTable(rows: string[][]) {
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var tr = document.createElement("tr");

        for (var j = 0; j < row.length; j++) {
            var td = document.createElement("td");
            td.innerText = row[j];
            tr.appendChild(td);
        }
        csv.tBodies[0].appendChild(tr);
    }
}