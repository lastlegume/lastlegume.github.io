var canvas = document.getElementById('game');
canvas.addEventListener('click', (e) => runTurn(e));
var text = document.getElementById('text');
var panel = document.getElementById('side-panel');
var container = document.getElementsByClassName('container')[0];
var clock = document.getElementById('clock');
document.onmousemove = function(e){updateMouseCoords(e);};
var startTime = document.getElementById('startTime');
var addTime = document.getElementById('addTime');

var mousePos = [-1,-1];
var time = startTime.value;
var timers = [time, time];
var lastDate = new Date();
canvas.width = Math.min(Math.round((Math.min(window.innerHeight, window.innerWidth) * .75) / 9) * 9, 999);
panel.style.maxWidth = Math.max(((canvas.width==window.innerHeight)?container.offsetWidth:200),container.offsetWidth-canvas.width-30)+"px";
clock.width = Math.max(((canvas.width==window.innerHeight)?container.offsetWidth:200),container.offsetWidth-canvas.width-30);
clock.height = clock.width/2+35;
canvas.height = canvas.width;
var size = canvas.width;
var turn = -1;
var gamemode = 0;
let inAction = false;
var ctx = canvas.getContext('2d');
var game = [];
var overallBoard = [0, 0, 0, 0, 0, 0, 0, 0, 0];
let currentBoard = -2;
let lastMove = Array(2).fill(-1);
reset();

function reset() {
    text.innerHTML = "Choose a way to play (click the column to choose that mode)";
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
function frame(t){
    drawBoard();
    drawTimer();
//currentBoard = Math.floor(Math.random()*9)
    window.requestAnimationFrame(frame)

}
window.requestAnimationFrame(frame)
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
            // if (currentBoard == (r * 3 + c) || (currentBoard == -1 && overallBoard[r * 3 + c] == 0)) {
            //     ctx.fillStyle = "rgba(81,232,133,.4)";
            //     ctx.fillRect(size / 3 * c + 1, size / 3 * r + 1, size / 3 - 2, size / 3 - 2);

            // }
            drawGrid(ctx, size / 3 * c, size / 3 * r, size / 3, size / 3);

        }
    }
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            if (((currentBoard == (Math.floor(r/3) * 3 + Math.floor(c/3))) || (currentBoard == -1 && overallBoard[Math.floor(r/3) * 3 + Math.floor(c/3)] == 0))&&game[r][c]==0) {
                ctx.fillStyle = "rgba(81,232,133,.4)";
                ctx.fillRect(size / 9 * c, size / 9 * r, size / 9, size / 9);   
            }
            if(mousePos[0]==c&&mousePos[1]==r){
                ctx.fillStyle = "rgba(200,232,0,.5)";
                if(turn>=0){
                    if(overallBoard[Math.floor(r/3) * 3 + Math.floor(c/3)] == 0)
                        ctx.fillRect(size / 9 * c, size / 9 * r, size / 9, size / 9); 
                }else 
                    ctx.fillRect(size / 3 * Math.floor(c/3), 0, size / 3, size);   
            }
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
        ctx.font = (size / 12) + "px Arial";
        ctx.fillText("Two Player", size / 24, size * 7/13, size / 3 - size / 12);
        ctx.fillText("Player First", 9 * size / 24, size * 7 / 13, size / 3 - size / 12);
        ctx.fillText("Computer First", 17 * size / 24, size * 7 / 13, size / 3 - size / 12);

    }
}
function drawTimer(){
    context = clock.getContext('2d');
    context.fillStyle = "#000000";
    context.fillRect(0, 0, clock.width, clock.height);
    context.strokeStyle = "#FFFFFF";
    context.beginPath();
    let radius = clock.width/4-1;
    context.arc(clock.width/4, clock.width/4, radius , 0, 2*Math.PI);
    context.stroke();
    context.beginPath();
    context.arc(clock.width*3/4, clock.width/4, radius, 0, 2*Math.PI);
    context.stroke();
    context.font = "24px Arial";
    context.strokeStyle = "#FF7F50";
    context.beginPath();
    context.moveTo(clock.width/4, clock.width/4);
    Math.PI*timers[0]/time
    context.lineTo(clock.width/4+Math.sin(2*Math.PI*timers[0]/time)*(radius-5), clock.width/4-Math.cos(2*Math.PI*timers[0]/time)*(radius-5));
    context.stroke();
    
    context.strokeText((timers[0]/1000).toFixed(3),10,clock.height-5, clock.width/2-10)

    context.strokeStyle = "#FFFF00";
    context.beginPath();
    context.moveTo(clock.width*3/4, clock.width/4);
    context.lineTo(clock.width*3/4+Math.sin(2*Math.PI*timers[1]/time)*(radius-5), clock.width/4-Math.cos(2*Math.PI*timers[1]/time)*(radius-5));
    context.stroke();
    if(turn>=0&&turn<100)
    timers[turn%2]-=(new Date()).getTime()-lastDate.getTime();
    lastDate = new Date();
    timers[turn%2] = Math.max(timers[turn%2],0)

    context.strokeText((timers[1]/1000).toFixed(3),10+clock.width/2,clock.height-5, clock.width/2-10)

}
function runTurn(e) {
    if (inAction)
        return;
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
        timers = [startTime.value, startTime.value];
        time = startTime.value;
        if(gamemode==2){
            computerTurn(turn%2+1);
            drawBoard();
            turn++;
        }
        text.innerHTML = "<b>Current Turn: </b> X";
        return;
    }
    //don't count repeat clicks
    if (game[coords[1]][coords[0]] != 0)
        return;
    //don't run if in the wrong board
    if (currentBoard >= 0 && currentBoard != (Math.floor(coords[1] / 3) * 3 + Math.floor(coords[0] / 3)))
        return;
    inAction = true;

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
            // if(tempBoard.map((e)=>e==0?0:1).reduce((p,c)=>p+c)==9&&((r*3+c)==currentBoard))
            //     currentBoard=-1;
            // if(overallBoard[(r*3+c)]>0&&r*3+c==currentBoard)
            //     currentBoard=-1;
        }
    }
    if (overallBoard[currentBoard] > 0)
        currentBoard = -1;
    // if(game[currentBoard].map((e)=>e==0?0:1).reduce((p,c)=>p+c)==9)
    //     currentBoard = -1;

    let winner = getWinner([overallBoard.slice(0, 3), overallBoard.slice(3, 6), overallBoard.slice(6, 9)]);
    let spacesLeft = getUsableSpacesLeft();
    if (winner > 0) {
        //winning code goes here
        console.log(`${winner} is the winner`);
        text.innerHTML = "<b>" + ((winner == 1) ? "X" : "O") + "</b> is the winner";
        currentBoard = -2;
        lastMove = Array(2).fill(-1);
        turn = 1000;
    } else if(spacesLeft==0){
        //if you are sent to a square that is a draw, can you place anywhere or is it a draw?
        text.innerHTML = "<b>The game is a draw.</b> There are no possible moves left";
        currentBoard = -2;
        lastMove = Array(2).fill(-1);
        turn = 1000;
    }else
        text.innerHTML = "<b>Current Turn: </b> " + ((turn % 2 == 1) ? "X" : "O");
//    console.log(scoreBoard([1, 1, 0, 0, 0, 0, 0, 0, 0], 1));

    //console.log(overallBoard);
    drawBoard();
    timers[turn%2]=(timers[turn%2]*1)+(addTime.value*1);
    timers[turn%2] = Math.min(timers[turn%2], time*1);
    turn++;
    // 0 is two player, 1 is player first, and 2 is computer first
    if (turn % 2 == 2 - gamemode&&winner==0&&spacesLeft>0) {
        computerTurn(turn%2+1);
        drawBoard();
        turn++;
    }
    inAction = false;
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
function computerTurn(player) {
    let overallScores = [];
    let playerScores = [scoreBoard(overallBoard, player),scoreBoard(overallBoard, 3-player)];
    for (let r = 0; r < 3; r++) {
        for (let c = 0; c < 3; c++) {
            overallScores.push(scoreBoard([...game[r*3].slice(c*3, c*3+3), ...game[r*3+1].slice(c*3, c*3+3), ...game[r*3+2].slice(c*3, c*3+3)],player));
            let tempScores = scoreBoard([...game[r*3].slice(c*3, c*3+3), ...game[r*3+1].slice(c*3, c*3+3), ...game[r*3+2].slice(c*3, c*3+3)],3-player);
            overallScores[r*3+c] = overallScores[r*3+c].map(function (num, idx) {return num * 1.5 + tempScores[idx];});
        }
    }

    let overallSums = [0,0,0,0,0,0,0,0,0];
    for(let i = 0;i<9;i++){
        if(overallBoard[i]>0)
            overallSums[i] = 0;
        else
            overallSums[i] = overallScores[i].reduce((prev, cur)=>prev+cur, 0);
    }

    let totalScoreSum = overallSums.map((x, i)=>(x*playerScores[1][i])).reduce((prev, cur)=>prev+cur, 0);
    for(let b = ((currentBoard<0)?0:currentBoard);b<((currentBoard<0)?9:currentBoard+1);b++){
        for(let i = 0;i<9;i++){
            if(game[Math.floor(b/3)*3+Math.floor(i/3)][(b%3)*3+(i%3)]>0)
                overallScores[b][i]=-100000;
            else{    
                overallScores[b][i]*=playerScores[0][b];
                overallScores[b][i]-=(((overallBoard[i]>0)?(totalScoreSum/5):(overallSums[i]*playerScores[1][i]/2)))/3;
            }
        }
    }
    let move = 0;
    if(currentBoard>=0){
        move = overallScores[currentBoard].reduce((maxIdx, x, i, arr) => x+(Math.random()-.5)/20 > arr[maxIdx] ? i : maxIdx, 0);
        game[Math.floor(currentBoard/3)*3+Math.floor(move/3)][(currentBoard%3)*3+move%3] = player;
        lastMove = [(currentBoard%3)*3+move%3, Math.floor(currentBoard/3)*3+Math.floor(move/3)];
        currentBoard = move;
    }else{
        let max = -99999;
        let maxBoard = -1;
        for(let b = 0;b<9;b++){
            if(overallBoard[b]==0){
                for(let i = 0;i<9;i++){
                    if(overallScores[b][i]+(Math.random()-0.5)/20>max){
                        maxBoard = b;
                        move = i;
                        max = overallScores[b][i];
                    }
                }
            }
        }
        //not a problem, checked beforehand that there is somewhere to place
        // //what happens if you draw everywhere and there is no spot to place?
        // if(maxBoard==-1){
        //     //trigger draw here 
        // }
        game[Math.floor(maxBoard/3)*3+Math.floor(move/3)][(maxBoard%3)*3+move%3] = player;
        lastMove = [(maxBoard%3)*3+move%3, Math.floor(maxBoard/3)*3+Math.floor(move/3)];
        currentBoard = move;
    }


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
}
function scoreBoard(board, player) {
    let scores = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (let i = 0; i < 9; i++) {
        let score = 0;
        if (board[i] == 0) {
            //vertical lines
            if (i < 3) {
                score += countOccurances([board[i], board[i + 3], board[i + 6]], player);
              //  score += countOccurances([board[i], board[i + 3], board[i + 6]], 3 - player);
            } else if (i > 2 && i < 6) {
                score += countOccurances([board[i], board[i + 3], board[i - 3]], player);
              //  score += countOccurances([board[i], board[i + 3], board[i - 3]], 3 - player);
            } else if (i > 5) {
                score += countOccurances([board[i], board[i - 3], board[i - 6]], player);
            //    score += countOccurances([board[i], board[i - 3], board[i - 6]], 3 - player);
            }
            //horizontal lines
            if (i % 3 == 0) {
                score += countOccurances([board[i], board[i + 1], board[i + 2]], player);
              //  score += countOccurances([board[i], board[i + 1], board[i + 2]], 3 - player);
            } else if (i % 3 == 1) {
                score += countOccurances([board[i], board[i + 1], board[i - 1]], player);
              //  score += countOccurances([board[i], board[i + 1], board[i - 1]], 3 - player);
            } else if (i % 3 == 2) {
                score += countOccurances([board[i], board[i - 1], board[i - 2]], player);
              //  score += countOccurances([board[i], board[i - 1], board[i - 2]], 3 - player);
            }
            if (i == 0 || i == 4 || i == 8) {
                score += countOccurances([board[0], board[4], board[8]], player);
              //  score += countOccurances([board[0], board[4], board[8]], 3 - player);
            }
            if (i == 2 || i == 4 || i == 6) {
                score += countOccurances([board[2], board[4], board[6]], player);
              //  score += countOccurances([board[2], board[4], board[6]], 3 - player);
            }

            scores[i] = score;
        }else
            scores[i] = 0;

    }
    return scores;
}
function countOccurances(list, item) {
    if (list.includes(3 - item))
        return 0;
    let count = list.reduce((prev, cur) => prev + (cur == item), 0);
    if (count == 2) {
        return 50;
    } else if (count == 1)
        return 3;
    return 1;
}
function getUsableSpacesLeft(){
    let count = 0;
    if(currentBoard>=0){
        count=[...game[Math.floor(currentBoard/3)*3].slice((currentBoard%3)*3, (currentBoard%3)*3+3), ...game[Math.floor(currentBoard/3)*3+1].slice((currentBoard%3)*3, (currentBoard%3)*3+3), ...game[Math.floor(currentBoard/3)*3+2].slice((currentBoard%3)*3, (currentBoard%3)*3+3)].reduce((prev, cur) => prev + (cur == 0), 0);
    }else{
        for(let r = 0;r<3;r++){
            for(let c = 0;c<3;c++){
                if(overallBoard[r*3+c]==0){
                    count+=[...game[r*3].slice(c*3, c*3+3), ...game[r*3+1].slice(c*3, c*3+3), ...game[r*3+2].slice(c*3, c*3+3)].reduce((prev, cur) => prev + (cur == 0), 0);
                }
            }
        }
    }
    return count;
}
function updateMouseCoords(e){
    let rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    let coords = Array(2).fill(-1);

    mousePos[0] = Math.floor(x * 9 / size);
    mousePos[1] = Math.floor(y * 9 / size);
}