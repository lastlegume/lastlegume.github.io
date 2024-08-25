//give the method the function and it'll graph it
//give the method a list of y coords and it'll graph it
//func is an object with either key function and function string or key list and list of y values
//settings contains keys xlab, ylab, xInc, xlim, ylim, col, coords, title
function graph(func, canvas, settings) {
    let isFunction = false;
    let funcs = [];
    if (Object.keys(func).includes("function")) {
        funcs = func.function;
        isFunction = true;
    }
    else if (Object.keys(func).includes("list"))
        funcs = func.list;
    let coords = 0;
    if (settings.coords)
        coords = settings.coords;
    else
        coords = { x: 0, y: 0, w: canvas.width, h: canvas.height, padding: 40 };
    let padding = coords.padding;
    let xlim = settings.xlim;
    let ylim = settings.ylim;
    let ylab = settings.ylab;
    let xlab = settings.xlab;
    let title = settings.title;
    let cols = settings.col;
    let xInc = settings.xInc;

    if (!xlim) {
        xlim = [0, 100];
    } else {
        xInc = (xlim[1] - xlim[0]) / (coords.w - padding);
    }
    if (!ylim) {
        ylim = [0, 100];
    }
    let ctx = canvas.getContext('2d');
    drawGrid(canvas, xInc, xlab, ylab, title, xlim, ylim, coords);
    //graph
    console.log(funcs);
    for (let funcIdx = 0; funcIdx < funcs.length; funcIdx++) {
        func = funcs[funcIdx];
        ctx.globalAlpha = 1;

        let col = cols[funcIdx];
        ctx.beginPath();
        if (col.includes("#") || col.includes("rgb"))
            ctx.strokeStyle = col;
        else
            ctx.strokeStyle = "#00FFA0";
        ctx.moveTo(coords.x + padding, coords.y + coords.h - padding);
        let lastOvershoot = -2;
        let overshoot = -1;
        let x = xlim[0];
        let pctY = 0;
        let val = 0;
        let wasNaN = isNaN(val);

        for (let i = 0; i < coords.w - padding; i++) {
            if (isFunction)
                val = solve(func.replaceAll('x', x));
            else
                val = func[i];
            if (wasNaN && !isNaN(val)) {
                pctY = (val - ylim[0]) / (ylim[1] - ylim[0]);
                ctx.moveTo(coords.x + padding + i, coords.y + (coords.h - padding) * (1 - Math.max(0, Math.min(1, pctY))));
            }
            wasNaN = isNaN(val);

            pctY = (val - ylim[0]) / (ylim[1] - ylim[0]);
            if (isFunction) {
                overshoot = -1;
                for (let s = 0; s < 1; s += .1) {
                    val = solve(func.replaceAll('x', x + s * xInc));
                    pctY = (val - ylim[0]) / (ylim[1] - ylim[0]);
                    if (pctY >= 1) {
                        if (overshoot == -1 && lastOvershoot == -1) {
                            overshoot = 0;
                            ctx.lineTo(coords.x + padding + i, coords.y);
                        }
                        else
                            ctx.moveTo(coords.x + padding + i, coords.y);
                        lastOvershoot = 0;
                    } else if (pctY <= 0) {
                        if (overshoot == -1 && lastOvershoot == -1) {
                            overshoot = 1;
                            ctx.lineTo(coords.x + padding + i, coords.y + (coords.h - padding));
                        }
                        else
                            ctx.moveTo(coords.x + padding + i, coords.y + (coords.h - padding));
                        lastOvershoot = 1;

                    } else if (wasNaN && !isNaN(val)) {
                        ctx.moveTo(coords.x + padding + i, coords.y + (coords.h - padding) * (1 - Math.max(0, Math.min(1, pctY))));
                        wasNaN = false;
                    }
                }
                if (pctY >= 0 && pctY <= 1)
                    lastOvershoot = -1;
            }
            ctx.lineTo(coords.x + padding + i, coords.y + (coords.h - padding) * (1 - Math.max(0, Math.min(1, pctY))));
            //console.log(x+" "+pctY*(ylim[1] - ylim[0]));
            // }
            if (Math.abs(pctY - .5) <= 1)
                ctx.stroke();

            x += xInc;

        }
        ctx.closePath();
    }
    //axes
    drawAxes(canvas, coords);
}
function drawGrid(canvas, xInc, xlab, ylab, title, xlim, ylim, coords) {
    let padding = coords.padding;
    let ctx = canvas.getContext('2d');
    ctx.clearRect(coords.x, coords.y, coords.w, coords.h);
    ctx.lineWidth = 1;
    ctx.textAlign = "center";
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "18px 'Trebuchet MS'";
    //title
    if (title) {
        ctx.fillText(title, coords.x + coords.w / 2 + padding / 2, coords.y + 24);
    }
    ctx.font = "9px 'Trebuchet MS'";

    //labels
    if (xlab) {
        ctx.fillText(xlab, coords.x + coords.w / 2 + padding / 2, coords.y + coords.h - 4);
    }
    if (ylab) {
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(ylab, coords.x + (coords.h - padding) * -.5, coords.y + 9);
        ctx.rotate(Math.PI / 2);
    }
    //grid

    // x=a lines
    let xGridInc = Math.round(coords.w / 30);
    let xGridSkips = Math.ceil(24 / xGridInc);
    for (let i = 0; i <= coords.w - padding; i += xGridInc) {
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(coords.x + padding + i, coords.y);
        ctx.lineTo(coords.x + padding + i, coords.y + coords.h - padding);
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = 1;
        if (i % (xGridInc * xGridSkips) == 0 && i + xGridInc + padding <= coords.w) {
            let label = (i * xInc) + xlim[0];
            ctx.fillText(toReadableNumber(label), coords.x + padding + i, coords.y + (coords.h - padding) + padding / 2, 24);
        }
    }
    // y=a lines

    let yGridInc = Math.max(Math.round(coords.w / 30), 15);
    for (let i = coords.h - padding; i >= 0; i -= yGridInc) {
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(coords.x + padding, coords.y + i);
        ctx.lineTo(coords.x + coords.w, coords.y + i);
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = 1;
        let label = (1 - (i / (coords.h - padding))) * (ylim[1] - ylim[0]) + ylim[0];
        if (i > 10)
            ctx.fillText(toReadableNumber(label), coords.x + padding - 13, coords.y + i, 22)
    }
}
function toReadableNumber(label) {
    return (label == 0) ? "0.00" : (Math.abs(label) < 100000 && Math.abs(label) >= 1000) ? Math.round(label) : (Math.abs(label) < 100000 && Math.abs(label) >= .01) ? label.toPrecision(3) : label.toExponential(2);
}
function drawAxes(canvas, coords) {
    let padding = coords.padding;
    let ctx = canvas.getContext('2d');
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    //horizontal axis
    ctx.moveTo(coords.x + padding, coords.y + coords.h - padding);
    ctx.lineTo(coords.x + coords.w, coords.y + coords.h - padding);
    //vertical axis
    ctx.moveTo(coords.x + padding, coords.y + coords.h - padding);
    ctx.stroke();
    ctx.lineTo(coords.x + padding, coords.y);
    ctx.stroke();
    ctx.closePath();
}


// test data set for the equation solver
// console.log(solve("2 ^ ( 3 ! * ( 2 * 1 ) ! ) + ( 1 - 3 )")); //4094
// console.log(solve("ln 5 * ln 6 + ( 6 ! * .5 + 3 )")); //365.884
// console.log(solve("e ^ ( 1 + 2 ) + pi")); //23.227
// console.log(solve("tan ( pi / 2 )")); // inf
// console.log(solve("( ( 3 - 4 ) * ( 3 - 6 ) ) / ( 3 - 5 )")); // -1.5
function solve(eq) {
    let terms = eq.toLowerCase().split(" ");
    let start = 0;
    let sol = 0;
    //resolves everything in parentheses
    for (let i = 0; i < terms.length; i++) {
        if (terms[i] === "e")
            terms[i] = Math.E;
        if (terms[i] === "pi")
            terms[i] = Math.PI;
        if (terms[i] === "(") {
            start = i;
            let numParenthesis = 1;
            while (numParenthesis > 0 && i < terms.length) {
                i++;
                if (terms[i] === "(")
                    numParenthesis++;
                else if (terms[i] === ")")
                    numParenthesis--;
                else if (terms[i] === "e")
                    terms[i] = Math.E;
                else if (terms[i] === "pi")
                    terms[i] = Math.PI;
            }
            sol = solve(terms.slice(start + 1, i).join(" "));
            terms.splice(start, i - start + 1, sol);
            i = start;
        }
    }
    for (let i = 0; i < terms.length; i++) {
        if (terms[i] === "^" && i > 0 && i < terms.length - 1) {
            sol = (terms[i - 1] * 1) ** (terms[i + 1] * 1);
            terms.splice(i - 1, 3, sol);
            i--;
        } else if (terms[i] === "!" && i > 0) {
            sol = factorial(terms[i - 1] * 1);
            terms.splice(i - 1, 2, sol);
            i--;
        } else if (terms[i] === "abs" && i < terms.length - 1) {
            sol = Math.abs(terms[i + 1] * 1);
            terms.splice(i, 2, sol);
        } else if (terms[i] === "sqrt" && i < terms.length - 1) {
            sol = Math.sqrt(terms[i + 1] * 1);
            terms.splice(i, 2, sol);
        } else if (terms[i] === "ln" && i < terms.length - 1) {
            sol = Math.log(terms[i + 1] * 1);
            terms.splice(i, 2, sol);
        } else if (terms[i] === "log" && i < terms.length - 2) {
            sol = Math.log(terms[i + 2] * 1) / Math.log(terms[i + 1] * 1);
            terms.splice(i, 3, sol);
        } else if (terms[i] === "sin" && i < terms.length - 1) {
            sol = Math.sin(terms[i + 1] * 1);
            terms.splice(i, 2, sol);
        } else if (terms[i] === "cos" && i < terms.length - 1) {
            sol = Math.cos(terms[i + 1] * 1);
            terms.splice(i, 2, sol);
        } else if (terms[i] === "tan" && i < terms.length - 1) {
            sol = Math.tan(terms[i + 1] * 1);
            terms.splice(i, 2, sol);
        } else if (terms[i] === "csc" && i < terms.length - 1) {
            sol = 1 / Math.sin(terms[i + 1] * 1);
            terms.splice(i, 2, sol);
        } else if (terms[i] === "sec" && i < terms.length - 1) {
            sol = 1 / Math.cos(terms[i + 1] * 1);
            terms.splice(i, 2, sol);
        } else if (terms[i] === "cot" && i < terms.length - 1) {
            sol = 1 / Math.tan(terms[i + 1] * 1);
            terms.splice(i, 2, sol);
        }
    }
    for (let i = 1; i < terms.length - 1; i++) {
        if (terms[i] === "*") {
            sol = (terms[i - 1] * 1) * (terms[i + 1] * 1);
            terms.splice(i - 1, 3, sol);
            i--;
        } else if (terms[i] === "/") {
            sol = (terms[i - 1] * 1) / (terms[i + 1] * 1);
            terms.splice(i - 1, 3, sol);
            i--;
        }
    }
    for (let i = 1; i < terms.length - 1; i++) {
        if (terms[i] === "+") {
            sol = terms[i - 1] * 1 + terms[i + 1] * 1;
            terms.splice(i - 1, 3, sol);
            i--;
        } else if (terms[i] === "-") {
            sol = terms[i - 1] * 1 - terms[i + 1] * 1;
            terms.splice(i - 1, 3, sol);
            i--;
        }
    }
    return terms[0];
}

function factorial(n) {
    if (n <= 1)
        return 1;
    return n * factorial(n - 1);
}
//data is an object that either contains key data and the raw data or key binQuantities that has an a list of quantities for each bin
//settings can have title, xRange, xlab, color, coords, highlight, highlightCol, mean
function hist(canvas, data, numBins, settings) {
    let coords = 0;
    if (settings.coords)
        coords = settings.coords;
    else
        coords = { x: 0, y: 0, w: canvas.width, h: canvas.height, padding: 40 };
    if (Object.keys(data).includes("data")) {
        data = data.data;
    }

    let min = 0;
    let max = 0;
    if (!settings.xRange) {
        min = Math.min(...data);
        max = Math.max(...data);
    } else {
        min = settings.xRange[0];
        max = settings.xRange[1];
    }
    let range = max - min;
    let binSize = range / numBins;
    let thresholds = [];
    for (let i = 1; i <= numBins; i++) {
        thresholds.push(min + i * binSize);
    }
    let numInBins = Array(numBins).fill(0);
    if (Object.keys(data).includes("binQuantities")) {
        data = data.binQuantities;
        for (let i = 0; i < data.length; i++)
            numInBins[i] = data[i];
    } else {
        for (let val of data) {
            for (let i = 0; i < numBins; i++) {
                if (val < thresholds[i])
                    numInBins[i]++;
            }
        }
    }
    let ctx = canvas.getContext('2d');
    ctx.clearRect(coords.x, coords.y, coords.w, coords.h);

    let padding = coords.padding;
    let total = numInBins.reduce((prev, cur) => prev + cur);
    let binWidth = Math.floor((coords.w - padding * 2) / numBins);
    coords.w = binWidth * numBins + padding * 2;
    ctx.font = "18px 'Trebuchet MS'";
    ctx.fillStyle = "#FFFFFF";
    ctx.textAlign = "center";
    if (settings.title) {
        ctx.fillText(settings.title, coords.x + coords.w / 2 + padding / 2, coords.y + 24);
    }
    if (settings.mean) {
        ctx.fillText(`Mean: ${settings.mean}`, coords.x + coords.w / 2 + padding / 2, coords.y + 48);

    }
    ctx.font = "12px 'Trebuchet MS'";


    ctx.lineWidth = 2;

    //labels
    if (settings.xlab) {
        ctx.fillText(settings.xlab, coords.x + coords.w / 2 + padding / 2, coords.y + coords.h - 4);
    }
    ctx.rotate(-Math.PI / 2);
    ctx.fillText("Frequency", coords.x + (coords.h - padding) * -.5, coords.y + 9);
    ctx.rotate(Math.PI / 2);
    ctx.fillStyle = settings.color;
    ctx.strokeStyle = settings.color;
    ctx.globalAlpha = 1;

    for (let i = 0; i < numBins; i++) {
        if (i == settings.highlight) {
            ctx.fillStyle = settings.highlightCol;
            ctx.strokeStyle = settings.highlightCol;
        }
        ctx.strokeRect(padding + coords.x + binWidth * i, coords.y + padding + ((coords.h - padding * 2) * (1 - numInBins[i] / total)), binWidth, (coords.h - padding * 2) * (numInBins[i] / total));
        ctx.fillText(min + binSize * i, padding + coords.x + binWidth * i, coords.y + coords.h - padding + 13, binWidth / 2);

        ctx.globalAlpha = .4;
        ctx.fillRect(padding + coords.x + binWidth * i, coords.y + padding + ((coords.h - padding * 2) * (1 - numInBins[i] / total)), binWidth, (coords.h - padding * 2) * (numInBins[i] / total));

        ctx.globalAlpha = 1;
        if ((coords.h - padding * 2) * (numInBins[i] / total) > 30)
            ctx.fillText(numInBins[i], padding + coords.x + binWidth * (i + 0.5), coords.y + padding + ((coords.h - padding * 2) * (1 - numInBins[i] / total)) + 16, binWidth)
        else
            ctx.fillText(numInBins[i], padding + coords.x + binWidth * (i + 0.5), coords.y + padding + ((coords.h - padding * 2) * (1 - numInBins[i] / total)) - 7, binWidth)
        if (i == settings.highlight) {
            ctx.fillStyle = settings.color;
            ctx.strokeStyle = settings.color;
        }
    }
    //makes frame of highlight bin go over the other bins
    if (settings.highlight >= 0 && settings.highlight < numBins) {
        ctx.strokeStyle = settings.highlightCol;
        ctx.strokeRect(padding + coords.x + binWidth * settings.highlight, coords.y + padding + ((coords.h - padding * 2) * (1 - numInBins[settings.highlight] / total)), binWidth, (coords.h - padding * 2) * (numInBins[settings.highlight] / total));

    }


    drawAxes(canvas, coords);

}


