var file = document.getElementById('file');
var csv = document.getElementById('csv');
var separatore = document.getElementById('separatore');
var btnCarica = document.getElementById('btnCarica');
btnCarica.onclick = function () {
    csv.tBodies[0].innerHTML = "";
    if (file.files && file.files.length > 0) {
        var fileUrl = file.files[0];
        var reader = new FileReader();
        reader.addEventListener('load', fileLoaded);
        reader.readAsText(fileUrl);
    }
};
function fileLoaded(event) {
    try {
        var scanner = new Scanner(event.target.result, separatore.value);
        var tokens = scanner.ScanTokens();
        var parser = new Parser(tokens);
        var result = parser.Parse();
        buildTable(result);
    }
    catch (error) {
        var tr = document.createElement('tr');
        var td = document.createElement('td');
        td.innerHTML = error.message;
        tr.appendChild(td);
        tr.classList.add('has-background-danger');
        csv.tBodies[0].appendChild(tr);
    }
}
function buildTable(rows) {
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
//# sourceMappingURL=yacv.js.map