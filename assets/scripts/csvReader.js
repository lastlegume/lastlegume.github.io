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

    return csv;
}