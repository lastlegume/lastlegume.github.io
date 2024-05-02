var canvas = document.getElementById('game');
canvas.addEventListener('click', (e) => runTurn(e));
var text = document.getElementById('text');

canvas.width = Math.min(Math.round((Math.min(window.innerHeight, window.innerWidth) * .75) / 9) * 9, 999);
canvas.height = canvas.width;
var size = canvas.width;
var turn = -1;
var gamemode = 0;
var ctx = canvas.getContext('2d');
var game = [];
var overallBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentBoard = -2;
let lastMove = Array(2).fill(-1);
reset();

function reset() {
    text.innerHTML = "Choose a way to play";
    game = [];
    for (let i = 0; i < 9; i++) {
        game.push([0, 0, 0, 0, 0, 0, 0, 0, 0]);
    }

    overallBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];;
    turn = -1;
    drawBoard();

}
function drawGrid(ctx, x, y, w, h) {


    ctx.beginPath();
    ctx.moveTo(x + w / 3, y + 0);
    ctx.lineTo(x + w / 3, y + h);
    ctx.moveTo(x + w * 2 / 3, y + 0);
    ctx.lineTo(x + w * 2 / 3, y + h);
    ctx.moveTo(x, y + h / 3);
    ctx.lineTo(x + w, y + h / 3);
    ctx.moveTo(x, y + h / 3 * 2);
    ctx.lineTo(x + w, y + h / 3 * 2);
    ctx.stroke();

}
function drawBoard() {
    ctx.fillStyle = "#000000";

    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = "rgba(0,232,0,.7)";
    if (lastMove[0] + lastMove[1] >= 0)
        ctx.fillRect(size / 9 * lastMove[0], size / 9 * lastMove[1], size / 9, size / 9);

    ctx.lineWidth = 1;
    ctx.strokeStyle = "#EEEEEE";
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            if (currentBoard == (r * 3 + c) || (currentBoard == -1 && overallBoard[r * 3 + c] == 0)) {
                ctx.fillStyle = "rgba(81,232,133,.4)";
                ctx.fillRect(size / 3 * c + 1, size / 3 * r + 1, size / 3 - 2, size / 3 - 2);

            }
            drawGrid(ctx, size / 3 * c, size / 3 * r, size / 3, size / 3);

        }
    }
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            ctx.fillStyle = "#FFFFFF";
            ctx.font = (size / 9) + "px Arial";
            ctx.fillText(game[r][c] == 1 ? "X" : game[r][c] == 2 ? "O" : "", size / 9 * c + 8, size / 9 * (r + 1) - 6, size / 9 - 16);

        }
    }
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            ctx.fillStyle = "#FFFFFF";
            ctx.font = (size / 3) + "px Arial";
            ctx.fillText(overallBoard[r * 3 + c] == 1 ? "X" : overallBoard[r * 3 + c] == 2 ? "O" : "", size / 3 * c + 16, size / 3 * (r + 1) - 16, size / 3 - 32);
        }
    }
    ctx.lineWidth = 3;
    ctx.strokeStyle = "#FFFFFF";
    drawGrid(ctx, 0, 0, size, size);
    if (turn < 0) {
        ctx.fillStyle = "rgb(81,232,133)";
        ctx.font = (size / 9) + "px Arial";
        ctx.fillText("Click", size / 24, size * 3 / 5, size / 3 - size / 12);
        ctx.fillText("To", 9 * size / 24, size * 3 / 5, size / 3 - size / 12);
        ctx.fillText("Start", 17 * size / 24, size * 3 / 5, size / 3 - size / 12);

    }
}
function runTurn(e) {
    if (turn == 1001) {
        reset();
        currentBoard = -1;
        lastMove = Array(2).fill(-1);
        return;
    }
    let rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let coords = Array(2).fill(-1);

    coords[0] = Math.floor(x * 9 / size);
    coords[1] = Math.floor(y * 9 / size);
    if (turn == -1) {
        turn++;
        gamemode = Math.floor(coords[0] / 3);
        currentBoard = -1;
        drawBoard();
        text.innerHTML = "<b>Current Turn: </b> X";
        return;
    }
    //don't count repeat clicks
    if (game[coords[1]][coords[0]] != 0)
        return;
    //don't run if in the wrong board
    if (currentBoard >= 0 && currentBoard != (Math.floor(coords[1] / 3) * 3 + Math.floor(coords[0] / 3)))
        return;
    game[coords[1]][coords[0]] = turn % 2 + 1;
    currentBoard = (coords[1] % 3 * 3 + coords[0] % 3);

    lastMove = coords;
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            let tempBoard = game.slice(r * 3, r * 3 + 3);
            for (let i = 0; i < tempBoard.length; i++) {
                tempBoard[i] = tempBoard[i].slice(c * 3, c * 3 + 3);
            }
            overallBoard[(r * 3 + c)] = getWinner(tempBoard);
            // if(overallBoard[(r*3+c)]>0&&r*3+c==currentBoard)
            //     currentBoard=-1;
        }
    }
    if (overallBoard[currentBoard] > 0)
        currentBoard = -1;
    let winner = getWinner([overallBoard.slice(0, 3), overallBoard.slice(3, 6), overallBoard.slice(6, 9)]);
    if (winner > 0) {
        //winning code goes here
        console.log(`${winner} is the winner`);
        text.innerHTML = "<b>" + ((winner == 1) ? "X" : "O") + "</b> is the winner";
        currentBoard = -2;
        lastMove = Array(2).fill(-1);
        turn = 1000;
    } else
        text.innerHTML = "<b>Current Turn: </b> " + ((turn % 2 == 1) ? "X" : "O");

    //console.log(overallBoard);
    drawBoard();
    turn++;
}

function getWinner(board) {
    for (let i = 0; i < 3; i++) {
        if (board[i][0] > 0 && board[i][0] == board[i][1] && board[i][0] == board[i][2])
            return board[i][0];
        if (board[0][i] > 0 && board[0][i] == board[1][i] && board[0][i] == board[2][i])
            return board[0][i];
    }
    if (board[0][0] > 0 && board[0][0] == board[1][1] && board[0][0] == board[2][2])
        return board[0][0];
    if (board[2][0] > 0 && board[2][0] == board[1][1] && board[2][0] == board[0][2])
        return board[2][0]
    return 0;
}