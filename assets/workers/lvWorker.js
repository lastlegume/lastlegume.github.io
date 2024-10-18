let slopes = [[], []];
let populations = [[], []];
let variables = [];
let stepSize = .1;
let refreshRate = 7;
let xInc = 0.1;
let stepReps = 1;
let xlim = [0, 10];
let currentT = 0;
let stepScale = false;
let method = "";
let preyGrowth = [];
let predatorResponse = [];


onmessage = function (m) {
    //    console.log(m.data);
    if (m.data[0] === "init")
        initialize(m.data.slice(1));
    else if (m.data[0] === "step")
        step();
    else if (m.data[0] === "reset")
        reset();
    else if (m.data[0] === "send all")
        sendAll(m.data[1]);
}

function step() {
    for (let i = 0; i < ((!stepScale) ? (stepReps) : 1); i++) {

        if (method === "euler") {
            let sol = f(populations[0][currentT], populations[1][currentT]);
            slopes[0].push(sol[0]);
            slopes[1].push(sol[1]);
            populations[0].push(populations[0][currentT] + stepSize * slopes[0][currentT]);
            populations[1].push(populations[1][currentT] + stepSize * slopes[1][currentT]);
        } else if (method === "rk2") {
            let sol = f(populations[0][currentT], populations[1][currentT]);
            let nstar = populations[0][currentT] + stepSize / 2 * sol[0];
            let pstar = populations[1][currentT] + stepSize / 2 * sol[1];
            sol = f(nstar, pstar);
            slopes[0].push(sol[0]);
            slopes[1].push(sol[1]);
            populations[0].push(populations[0][currentT] + stepSize * slopes[0][currentT]);
            populations[1].push(populations[1][currentT] + stepSize * slopes[1][currentT]);
        } else if (method === "rk4") {
            let k1 = f(populations[0][currentT], populations[1][currentT]);
            let k2 = f(populations[0][currentT] + k1[0] * stepSize / 2, populations[1][currentT] + k1[1] / 2 * stepSize);
            let k3 = f(populations[0][currentT] + k2[0] * stepSize / 2, populations[1][currentT] + k2[1] / 2 * stepSize);
            let k4 = f(populations[0][currentT] + k3[0] * stepSize, populations[1][currentT] + k3[1] * stepSize);
            slopes[0].push(1 / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]));
            slopes[1].push(1 / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]));
            populations[0].push(populations[0][currentT] + stepSize * slopes[0][currentT]);
            populations[1].push(populations[1][currentT] + stepSize * slopes[1][currentT]);
        }
        currentT++;
    }
    if (populations[0][currentT] > maxPop)
        maxPop = populations[0][currentT];
    if (populations[1][currentT] > maxPop)
        maxPop = populations[1][currentT];
    maxSlope = Math.max(slopes[0][currentT - 1], maxSlope);
    maxSlope = Math.max(slopes[1][currentT - 1], maxSlope);
    minSlope = Math.min(slopes[0][currentT - 1], minSlope);
    minSlope = Math.min(slopes[1][currentT - 1], minSlope);
    postMessage(["stepped", [populations[0][currentT], populations[1][currentT]], [slopes[0][currentT - 1], slopes[1][currentT - 1]], [0, maxPop], [minSlope, maxSlope]])
}

function initialize(m) {
    variables = m[1];
    populations = [[m[0][0]], [m[0][1]]];
    stepSize = m[2][0];
    stepScale = m[2][1];
    method = m[3];
    preyGrowth = m[4];
    predatorResponse = m[5];
    slopes = [[], []];

    if (!stepScale) {
        stepReps = Math.max(Math.round(0.1 / stepSize), 1);
        console.log(stepReps);
    }

    currentT = 0;
    maxPop = -1;
    maxSlope = -1;
    minSlope = 1;
}

//pretty sure this won't be needed
function reset() {
    populations = [[], []];
    slopes = [[], []];
}
function f(N, P) {
    //variables is a list of [r, a, f, q, K, h]
    let answers = [0, 0];
    // dN/dt
    answers[0] = (preyGrowth[0] ? (variables[0] * N) : preyGrowth[1] ? (variables[0] * N * (1 - N / variables[4])) : 0) - (predatorResponse[0] ? (variables[1] * P * N) : predatorResponse[1] ? (variables[1] * P * N / (1 + variables[1] * variables[5] * N)) : 0);
    // dP/dt
    answers[1] = (predatorResponse[0] ? (variables[1] * variables[2] * P * N) : predatorResponse[1] ? (variables[1] * variables[2] * P * N / (1 + variables[1] * variables[5] * N)) : 0) - (variables[3] * P);
    return answers;
}

function sendAll(m){
    postMessage(["sent all", m, populations]);
}
