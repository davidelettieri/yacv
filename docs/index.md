<!DOCTYPE html>
<htm>

    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>YACE</title>
        <link rel="stylesheet" href="css/bulma.min.css">
    </head>

    <body>
        <div class="container">
            <h1 class="is-size-1 has-text-weight-bold">YACV</h1>
            <h2 class="is-size-3">Yet Another Csv Viewer</h2>
            <div class="field is-grouped">
                <div class="control">
                    <label class="label">Open a file</label>
                    <input class="input" type="file" id=file accept=".csv" />
                </div>
                <div class="control">
                    <label class="label">Delimiter</label>
                    <span class="select">
                        <select id=separatore>
                            <option selected value=",">,</option>
                            <option value=";">;</option>
                            <option value="|">|</option>
                            <option value="\t">tab</option>
                        </select>
                    </span>
                </div>
            </div>
            <button class="button" value="Carica" id=btnCarica>Load</button>
            <table id=csv class="table">
                <tbody>

                </tbody>
            </table>
        </div>

        <script src="js/parser.js"></script>
        <script src="js/yace.js"></script>
    </body>
</htm>