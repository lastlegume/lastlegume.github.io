//give the method the function and it'll graph it
function graph(func, canvas, xInc, xlab, ylab, xlim, ylim, col) {
    let padding = 40;
    if (!xlim) {
        xlim = [0, 100];
    } else {
        xInc = (xlim[1] - xlim[0]) / (canvas.width - padding);
    }
    if (!ylim) {
        ylim = [0, 100];
    }

    drawGrid(canvas, xInc, xlab, ylab, xlim, ylim, padding);
    //graph 
    ctx.globalAlpha = 1;

    ctx.beginPath();
    if (col.includes("#") || col.includes("rgb"))
        ctx.strokeStyle = col;
    else
        ctx.strokeStyle = "#00FFA0";
    ctx.moveTo(padding, canvas.height - padding);
    let lastOvershoot = -2;
    let overshoot = -1;
    let x = xlim[0];
    for (let i = 0; i < canvas.width - padding; i++) {
        let pctY = (solve(func.replaceAll('x', x)) - ylim[0]) / (ylim[1] - ylim[0]);
        overshoot = -1;
        for (let s = 0; s < 1; s += .1) {
            pctY = (solve(func.replaceAll('x', x + s * xInc)) - ylim[0]) / (ylim[1] - ylim[0]);
            if (pctY >= 1) {
                if (overshoot == -1 && lastOvershoot == -1) {
                    overshoot = 0;
                    ctx.lineTo(padding + i, 0);
                }
                else
                    ctx.moveTo(padding + i, 0);
                lastOvershoot = 0;
            } else if (pctY <= 0) {
                if (overshoot == -1 && lastOvershoot == -1) {
                    overshoot = 1;
                    ctx.lineTo(padding + i, (canvas.height - padding));
                }
                else
                    ctx.moveTo(padding + i, (canvas.height - padding));
                lastOvershoot = 1;

            }

        }
        if (pctY >= 0 && pctY <= 1)
            lastOvershoot = -1;
        ctx.lineTo(padding + i, (canvas.height - padding) * (1 - Math.max(0, Math.min(1, pctY))));
        //console.log(x+" "+pctY*(ylim[1] - ylim[0]));

        x += xInc;

    }
    ctx.stroke();
    ctx.closePath();
    //axes
    drawAxes(canvas, padding);
}

//give the method a list of y coords and it'll graph it
function graphList(yVals, canvas, xInc, xlab, ylab, xlim, ylim, col) {
    let padding = 40;
    if (!xlim) {
        xlim = [0, 100];
    } else {
        xInc = (xlim[1] - xlim[0]) / (canvas.width - padding);
    }
    if (!ylim) {
        ylim = [0, 100];
    }

    drawGrid(canvas, xInc, xlab, ylab, xlim, ylim, padding);

    //graph 
    ctx.globalAlpha = 1;

    ctx.beginPath();
    if (col.includes("#") || col.includes("rgb"))
        ctx.strokeStyle = col;
    else
        ctx.strokeStyle = "#00FFA0";
    ctx.moveTo(padding, canvas.height - padding);
    let lastOvershoot = -2;
    let overshoot = -1;
    let x = xlim[0];
    for (let i = 0; i < canvas.width - padding; i++) {
        let pctY = (yVals[i] - ylim[0]) / (ylim[1] - ylim[0]);
        overshoot = -1;
        for (let s = 0; s < 1; s += .01) {
            pctY = (yVals[i] - ylim[0]) / (ylim[1] - ylim[0]);
            if (pctY >= 1) {
                if (overshoot == -1 && lastOvershoot == -1) {
                    overshoot = 0;
                    ctx.lineTo(padding + i, 0);
                }
                else
                    ctx.moveTo(padding + i, 0);
                lastOvershoot = 0;
            } else if (pctY <= 0) {
                if (overshoot == -1 && lastOvershoot == -1) {
                    overshoot = 1;
                    ctx.lineTo(padding + i, (canvas.height - padding));
                }
                else
                    ctx.moveTo(padding + i, (canvas.height - padding));
                lastOvershoot = 1;

            }
        }
        if (pctY >= 0 && pctY <= 1)
            lastOvershoot = -1;
        ctx.lineTo(padding + i, (canvas.height - padding) * (1 - Math.max(0, Math.min(1, pctY))));


        x += xInc;

    }
    ctx.stroke();
    ctx.closePath();
    //axes
    drawAxes(canvas, padding);

}

function drawGrid(canvas, xInc, xlab, ylab, xlim, ylim, padding) {

    ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.lineWidth = 1;
    ctx.textAlign = "center";
    ctx.strokeStyle = "#FFFFFF";
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "9px";
    //labels
    if (xlab) {
        ctx.fillText(xlab, canvas.width / 2 + padding / 2, canvas.height);
    }
    if (ylab) {
        ctx.rotate(-Math.PI / 2);
        ctx.fillText(ylab, (canvas.height - padding) * -.5, 9);
        ctx.rotate(Math.PI / 2);
    }
    //grid

    // x=a lines
    let xGridInc = Math.round(canvas.width / 30);
    let xGridSkips = Math.ceil(24 / xGridInc);
    for (let i = 0; i <= canvas.width; i += xGridInc) {
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(padding + i, 0);
        ctx.lineTo(padding + i, canvas.height - padding);
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = 1;
        if (i % (xGridInc * xGridSkips) == 0 && i + xGridInc + padding <= canvas.width) {
            let label = (i * xInc) + xlim[0];
            ctx.fillText(toReadableNumber(label), padding + i, (canvas.height - padding) + padding / 2, 24);
        }
    }
    // y=a lines
    
    let yGridInc = Math.max(Math.round(canvas.width / 30), 15);
    for (let i = canvas.height - padding; i >= 0; i -= yGridInc) {
        ctx.globalAlpha = 0.1;
        ctx.beginPath();
        ctx.moveTo(padding, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
        ctx.closePath();
        ctx.globalAlpha = 1;
        let label = (1 - (i / (canvas.height - padding))) * (ylim[1] - ylim[0]) + ylim[0];
        ctx.fillText(toReadableNumber(label), padding - 13, i, 22)
    }
}
function toReadableNumber(label){
    return (label == 0) ? "0.00" : (Math.abs(label) < 100000 && Math.abs(label) >= 1000) ? Math.round(label) : (Math.abs(label) < 100000 && Math.abs(label) >= .01) ? label.toPrecision(3) : label.toExponential(2);
}
function drawAxes(canvas, padding) {
    ctx.lineWidth = 2;

    ctx.strokeStyle = "#FFFFFF";
    ctx.beginPath();
    //horizontal axis
    // if(ylim[0]<=0&&ylim[1]>=0){
    //     let pctY = -1*(ylim[0]) / (ylim[1] - ylim[0]);
    //     ctx.moveTo(padding, (canvas.height - padding) * (1 - Math.max(0, Math.min(1, pctY))));
    //     ctx.lineTo(canvas.width, (canvas.height - padding) * (1 - Math.max(0, Math.min(1, pctY))));
    // }else{
        ctx.moveTo(padding, canvas.height - padding);
        ctx.lineTo(canvas.width, canvas.height - padding);
    // }
    //vertical axis
    ctx.moveTo(padding, canvas.height - padding);
    ctx.stroke();
    ctx.lineTo(padding, 0);
    ctx.stroke();
    ctx.closePath();
}


// test data set for the equation solver
// console.log(solve("2 ^ ( 3 ! * ( 2 * 1 ) ! ) + ( 1 - 3 )"));
// console.log(solve("ln 5 * ln 6 + ( 6 ! * .5 + 3 )"));
// console.log(solve("e ^ ( 1 + 2 ) + pi"));
// console.log(solve("tan ( pi / 2 )"));
function solve(eq) {
    let terms = eq.split(" ");
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

        // if (i + 1 >= terms.length && terms.length > 1 && counter < 50) {
        //     i = 0;
        //     counter++;
        //     noexponents = !terms.includes("^") && !terms.includes("!") && !terms.includes("log") && !terms.includes("ln");;
        //     nomult = !terms.includes("/") && !terms.includes("*");

        // }
    }
    return terms[0];
}

function factorial(n) {
    if (n <= 1)
        return 1;
    return n * factorial(n - 1);
}