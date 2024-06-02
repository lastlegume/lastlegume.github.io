var maze = [];
var visited = [];

var size = 15;
var tileSize = 30;
var tileGap = 10;

var sizeInput = document.getElementById('size');
var speedInput = document.getElementById('speed');

var generate = document.getElementById('generate');
generate.addEventListener('click', () => makeMaze());
var solution = document.getElementById('solution');
solution.addEventListener('click', () => showSolution());

var canvas = document.getElementById('maze');
canvas.width = size*(tileSize+tileGap)+90;
canvas.height = size*(tileSize+tileGap)+90;

var ctx = canvas.getContext('2d');
var stack = [];
var cr = 0;
var cc = 0;
let start, previousTimeStamp;
var id;

var visited, path;


makeMaze();


function makeMaze() {
    solution.disabled = true;
    let speed = speedInput.value;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if(sizeInput.value>0)
        size = sizeInput.value;
    tileSize=Math.max(35-size, 10);
    tileGap = tileSize;
    canvas.width = size*(tileSize+tileGap)+tileGap;
    canvas.height = size*(tileSize+tileGap)+tileGap;
    ctx.fillStyle  = '#000000';
    ctx.fillRect(0,0,size*(tileSize+tileGap)+tileGap, size*(tileSize+tileGap)+tileGap)
    maze = [[]];
    for(let i = 0;i<size*2+2;i++){
        maze[0].push('#');
    }
    visited = [];
        for(let r = 0;r<size;r++){
            maze.push(['#']);
            maze.push(['#']);
            
            visited.push([]);
            for(let c = 0;c<size;c++){
                maze[r*2+1].splice(1, 0, 0, '#');
                maze[r*2+2].splice(1, 0, '#', '#');

//                maze[r*3+3].splice(1, 0, '#', '#');

                visited[r].push(0);
            }
        }
        // maze.push([]);
        // for(let i = 0;i<size*3+2;i++){
        //     maze[maze.length-1].push('#');
        // }
       // cr = Math.floor(Math.random() * maze.length);
       // cc = Math.floor(Math.random() * maze[cr].length);
        stack.push({"row": cr, "col": cc});
        // console.log(maze);

        visited[cr][cc] = 1;
        ctx.fillStyle  = '#FFFFFF';
        if(speedInput.value<=0){
            while(stack.length>0){
                makeLine();
            }
            makeLine();

        }else{
            id = setInterval(makeLine, speed);
        }
        
// while(stack.length>0){
//     let current = stack.pop();
//     cr = current.row;
//     cc = current.col;
//     console.log(current);

//     let neighbors = getNeighbors(cr, cc); 
//     if(neighbors.length>0){
//         stack.push({"row": cr, "col": cc});
//     }
//     visited[cr][cc] = 1;
//     ctx.fillRect(cc*(tileSize+tileGap)+50-tileGap/2,cr*(tileSize+tileGap)+45,tileSize, tileSize)
//         if(neighbors.length>0){
//             let index = neighbors.pop();
//         stack.push({"row": index.row, "col": index.col});
//         if(index.col==cc){
//             if(index.row>cr)
//                 ctx.fillRect(cc*(tileSize+tileGap)+50-tileGap/2,cr*(tileSize+tileGap)+50-tileGap/2,tileSize, tileSize*2+tileGap)
//             else
//                 ctx.fillRect(cc*(tileSize+tileGap)+50-tileGap/2,index.row*(tileSize+tileGap)+50-tileGap/2,tileSize, tileSize*2+tileGap)

//         }else{
//             if(index.col>cc)
//             ctx.fillRect(cc*(tileSize+tileGap)+50-tileGap/2,cr*(tileSize+tileGap)+50-tileGap/2,tileSize*2+tileGap, tileSize)
//         else
//             ctx.fillRect(index.col*(tileSize+tileGap)+50-tileGap/2,index.row*(tileSize+tileGap)+50-tileGap/2,tileSize*2+tileGap, tileSize)
//         }
// }   
             


            

        


// }
     

}

function makeLine(){
    ctx.fillStyle  = '#FFFFFF';

    if(stack.length==0){    
        ctx.fillStyle  = '#00FF45';
        ctx.fillRect(50-tileGap/2,50-tileGap/2,tileSize, tileSize);
        ctx.fillStyle  = '#FF2050';
        ctx.fillRect((size-1)*(tileSize+tileGap)+50-tileGap/2,(size-1)*(tileSize+tileGap)+50-tileGap/2, tileSize, tileSize);
        clearInterval(id);
        console.log(maze);
        solution.disabled = false;
}
    else{
        let current = stack.pop();
        cr = current.row;
        cc = current.col;
       // console.log(current);

        let neighbors = getNeighbors(cr, cc); 
        if(neighbors.length>0){
            stack.push({"row": cr, "col": cc});
        }
        visited[cr][cc] = 1;
     //   ctx.fillRect(cc*(tileSize+tileGap)+50-tileGap/2,cr*(tileSize+tileGap)+45,tileSize, tileSize)
            if(neighbors.length>0){
                let index = neighbors.pop();
            stack.push({"row": index.row, "col": index.col});
            // console.log('index');
            // console.log(index);
            // console.log('current');
            // console.log(current);

            if(index.col==cc){
                if(index.row>cr){
                    ctx.fillRect(cc*(tileSize+tileGap)+50-tileGap/2,cr*(tileSize+tileGap)+50-tileGap/2,tileSize, tileSize*2+tileGap)
                    maze[index.row*2][cc*2+1] = 0
                }
                else{
                    ctx.fillRect(cc*(tileSize+tileGap)+50-tileGap/2,index.row*(tileSize+tileGap)+50-tileGap/2,tileSize, tileSize*2+tileGap)
                    maze[cr*2][cc*2+1] = 0

                }

            }else{
                if(index.col>cc){
                    ctx.fillRect(cc*(tileSize+tileGap)+50-tileGap/2,cr*(tileSize+tileGap)+50-tileGap/2,tileSize*2+tileGap, tileSize)
                    maze[cr*2+1][index.col*2] = 0

                }
            else{
                ctx.fillRect(index.col*(tileSize+tileGap)+50-tileGap/2,index.row*(tileSize+tileGap)+50-tileGap/2,tileSize*2+tileGap, tileSize)
                maze[cr*2+1][cc*2] = 0

            }
            }
        }
    }
}
function getNeighbors(cr, cc){
    let neigbors = [];

    if(cr<visited.length && cc>=0 && cr-1>=0 && cc<visited[cr].length&&visited[cr-1][cc]==0){
        neigbors.push({"row": cr-1, "col": cc});
    } if(cr<visited.length && cc>=0 && cr>=0 && cc+1<visited[cr].length&&visited[cr][cc+1]==0){
        neigbors.push({"row": cr, "col": cc+1});
    } if(cr+1<visited.length && cc>=0 && cr>=0 && cc<visited[cr].length&&visited[cr+1][cc]==0){
        neigbors.push({"row": cr+1, "col": cc});
    } if(cr<visited.length && cc-1>=0 && cr>=0 && cc<visited[cr].length&&visited[cr][cc-1]==0){
        neigbors.push({"row": cr, "col": cc-1});

    }
    return neigbors.map(value => ({ value, sort: Math.random() })).sort((a, b) => a.sort - b.sort).map(({ value }) => value);
}





// function makeMaze() {
//     //Wilson's algorithm
//     maze = [];
//     for(let r = 0;r<size;r++){
//         maze.push([]);
//         for(let c = 0;c<size;c++){
//             maze[r].push(0);
//         }
//     }
//     console.log(maze);

//     //maze = [[3,3,3], [3,4,3], [4,4,4]]
//     // up 1, right 2, down 3, left 4
//     maze[Math.floor(Math.random() * maze[0].length)][Math.floor(Math.random() * maze.length)] = 5;
//     var remaining = maze.length * maze[0].length - 1;
//     while (remaining > 0) {
//         var path = walk();
//         console.log(maze);

//         let sx = 0;
//         let sy = 0;
//         // let sx = path[0];
//         // let sy = path[1];
//         path = {"r":1, "c":1}
//         console.log(path);
//         for (let i = 0; i < path.length; i++) {
//             sx = path["r"]
//         }

//         // for (let i = 2; i < path.length; i++) {
//         //     maze[sy][sx] = path[i];
//         //     if (path[i] == 1){
//         //         sy -= 1;
//         //         maze[sy][sx] = 3;
//         //     }
//         //     else if (path[i] == 2){
//         //         sx += 1;
//         //         maze[sy][sx] = 4;

//         //     }
//         //     else if (path[i] == 3){
//         //         sy += 1;
//         //         maze[sy][sx] = 1;

//         //     }
//         //     else if (path[i] == 4){
//         //         sx -= 1;
//         //         maze[sy][sx] = 2;

//         //     }

//         //     remaining -= 1;
//         // }

//         console.log("remaining: "+remaining);

//     }
//     console.log(maze);
//     print();
// }

// function walk() {
//     //find random cell
//     let sr = Math.floor(Math.random() * maze.length);
//     let sc = Math.floor(Math.random() * maze[0].length);
//     console.log(sr+" "+sc);
//     while (maze[sr][sc] != 0) {
//         sr = Math.floor(Math.random() * maze.length)
//         sc = Math.floor(Math.random() * maze[0].length);
//     }
//     // let x = sx;
//     // let y = sy;
//     let path = [];
//     // path.push(sx);
//     // path.push(sy);
//     let walking = true;
//     while (walking) {
//         walking = false;
//         let directions = getDirections(sr, sc);
//         for(let i = 0;i<directions.length;i++){
            
//         }
//     //     let directions = [1, 2, 3, 4];
//     //     let shuffled = directions
//     //         .map(value => ({ value, sort: Math.random() }))
//     //         .sort((a, b) => a.sort - b.sort)
//     //         .map(({ value }) => value);
//     //     for(let i = 0;i<shuffled.length;i++){
//     //         if (shuffled[i] == 1 && y+1<maze.length && x>=0 && y>=0 && x<maze[x].length&&maze[y+1][x]==0){
//     //             path.push(shuffled[i]);
//     //             i = 500;
//     //             y+=1;
//     //         }
//     //         else if (shuffled[i] == 2&& y<maze.length && x>=0 && y>=0 && x+1<maze[x].length&&maze[y][x+1]==0){
//     //             path.push(shuffled[i]);
//     //             i = 500;
//     //             x+=1;
//     //         }
//     //         else if (shuffled[i] == 3&& y<maze.length && x>=0 && y-1>=0 && x<maze[x].length&&maze[y-1][x]==0){
//     //             path.push(shuffled[i]);
//     //             i = 500;
//     //             y-=1;
//     //         }else if (shuffled[i] == 4&& y<maze.length && x-1>=0 && y>=0 && x<maze[x].length&&maze[y][x-1]==0){
//     //             path.push(shuffled[i]);
//     //             i = 500;
//     //             x-=1;
//     //         }
//     //     }
//     //     if(maze[y][x]==0){
//     //         walking = true;
//     //     }
//     }
//     return path;
// }
// function getDirections(r, c){
//     let dirs = [];
//     if(r-1>=0&&c>=0&&r<maze.length&&c<maze[0].length)
//         dirs.push(1);
//     else if(r>=0&&c>=0&&r+1<maze.length&&c<maze[0].length)
//     dirs.push(3);
//     else if(r>=0&&c>=0&&r<maze.length&&c+1<maze[0].length)
//     dirs.push(2);
//     else if(r>=0&&c-1>=0&&r+1<maze.length&&c<maze[0].length)
//     dirs.push(4);
//     var shuffled = dirs
//             .map(value => ({ value, sort: Math.random() }))
//             .sort((a, b) => a.sort - b.sort)
//             .map(({ value }) => value);
//     return shuffled;
// }
// function print(){
//     str = ""
//     str+=" ";
//     for(let i = 0;i<maze[0].length*2-1;i++)
//         str+="_";
//     console.log(str);

//     for(let r = 0;r<maze.length;r++){
//         str ="";
//         str+="|";
//         for(let c = 0;c<maze.length;c++){
//             if (maze[r][c] && r+1 < maze.length && maze[r+1][c] == 0)
//                 str+=" ";
//             else
//                 str+=(maze[r][c] == 3) ? " " : "_";
//             if (maze[r][c] == 0 && c+1 < maze[r].length && maze[r][c+1] == 0)
//                 str+=(r+1 < maze.length && (maze[r+1][c] == 0 || maze[r+1][c+1] == 0)) ? " " : "_";
//               else if (maze[r][c]==4)
//                 str+=((maze[r][c]==3 || maze[r][c+1]==3) ) ? " " : "_";
//               else
//                 str+="|";
//         }
//         console.log(str);

//     }
// }
function showSolution(){

    visited = [];
    path = [];
    for(let i = 0;i<maze.length;i++){
        visited.push(new Array(maze[i].length).fill(0));
        path.push(new Array(maze[i].length).fill(0));
    
    }

    ctx.strokeStyle  = '#10a0FF';
    ctx.lineWidth  = 2;

    let solution = solve(1, 1);
    console.log(path)
    for(let r = 0;r<path.length;r++){
        for(let c = 0;c<path[r].length;c++){
            if(path[r][c]==1){

            }
        }
    }
}
function solve(r, c){
    if(r==(size*2-1)&&c==(size*2-1)){
        return true;
    }
//    ctx.fillRect((size-1)*(tileSize+tileGap)+50-tileGap/2,(size-1)*(tileSize+tileGap)+50-tileGap/2, tileSize, tileSize);

    if(maze[r][c]!=0||visited[r][c]==1)
        return false;
    visited[r][c] = 1;
    if(r>0&&solve(r-1, c)){
        path[r][c] = 1;
        ctx.beginPath();
        ctx.moveTo((c-1)*(tileSize)+50, (r-1)*(tileSize)+50);
        ctx.lineTo((c-1)*(tileSize)+50, (r-2)*(tileSize)+50);
        ctx.stroke();

        return true;
    } else if(r<maze.length-1&&solve(r+1, c)){
        path[r][c] = 1;
        ctx.beginPath();
        ctx.moveTo((c-1)*(tileSize)+50, (r-1)*(tileSize)+50);
        ctx.lineTo((c-1)*(tileSize)+50, (r)*(tileSize)+50);
        ctx.stroke();
        return true;
    } else if(c>0&&solve(r, c-1)){
        path[r][c] = 1;
        ctx.beginPath();
        ctx.moveTo((c-1)*(tileSize)+50, (r-1)*(tileSize)+50);
        ctx.lineTo((c-2)*(tileSize)+50, (r-1)*(tileSize)+50);
        ctx.stroke();
        return true;
    } else if(c<maze[r].length-1&&solve(r, c+1)){
        path[r][c] = 1;
        ctx.beginPath();
        ctx.moveTo((c-1)*(tileSize)+50, (r-1)*(tileSize)+50);
        ctx.lineTo((c)*(tileSize)+50, (r-1)*(tileSize)+50);
        ctx.stroke();
        return true;
    }
    return false;


}