var playerRed = "R";
var playerYellow = "Y";
var currPlayer = playerRed;

var gameOver = false;
var board;
var currColumns;

var rows = 6;
var columns = 7;

window.onload = function () {
    setGame();
}

function setGame() {
    console.log("hello")
    currColumns = [5,5,5,5,5,5,5];
    board = [];

    for (r = 0; r < rows; r++) {
        let row = [];
        for (c = 0; c < columns; c++) {
            //JS
            row.push(' ');
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.classList.add("tile");
            tile.addEventListener("click", () =>{fix(event)});
            document.getElementById("board").append(tile);
        }
        board.push(row);
    }
    console.log(board)
}

function fix(event){
    setPiece(event.target);
    setPiece(event.target, true);
}

function setPiece(target, iaPlay = false) {
    let coords;
    let c;

    if (gameOver) {
        return;
    }
    if(iaPlay == true){
        coords = getIaPlay();
        c = parseInt(coords[0]);
    }
    else{
        coords = target.id.split("-"); //"0-0" -> ["0", "0"]   
        c = parseInt(coords[1]);
    }
    
    r = currColumns[c];
    if (r < 0) {
        return;
    }
    

    board[r][c] = currPlayer;
    let tile = document.getElementById(r.toString() + "-" + c.toString());
    if (currPlayer == playerRed) {
        tile.classList.add("red-piece");
        currPlayer = playerYellow
        //player.innerText("Jaune joue");
    } else {
        tile.classList.add("yellow-piece");
        currPlayer = playerRed;
        //player.innerText("Rouge joue");
    }

    currColumns[c] = r-1;

    checkWinner();
    console.log(convertBoardToMcts())
}

function checkWinner() {
    //horizontally
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r][c+1] && board[r][c] == board[r][c+2] && board[r][c] == board[r][c+3]) {
                    setWinner(r,c);
                    return;
                }
            }
        }
    }

    for (let c = 0; c < columns; c++) {
        for (let r = 0; r < rows - 3; r++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c] && board[r][c] == board[r+2][c] && board[r][c] == board[r+3][c]) {
                    setWinner(r,c);
                    return;
                }
            }
        }
    }

    for (let r = 0; r < rows - 3; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r+1][c+1] && board[r][c] == board[r+2][c+2] && board[r][c] == board[r+3][c+3]) {
                    setWinner(r,c);
                    return;
                }
            }
        }
    }

    for (let r = 3; r < rows; r++) {
        for (let c = 0; c < columns - 3; c++) {
            if (board[r][c] != ' ') {
                if (board[r][c] == board[r-1][c+1] && board[r][c] == board[r-2][c+2] && board[r][c] == board[r-3][c+3]) {
                    setWinner(r,c);
                    return;
                }
            }
        }
    }
}

function setWinner(r,c) {
    let winner = document.getElementById("winner");
    if(board[r][c] == playerRed)  {
        winner.innerText = "Rouge à gagné !";
    } else {
        winner.innerText = "Yellow à gagné !";
    }

    gameOver = true;
}

function convertBoardToMcts(){
    let boardString ="";
    for(let col = 0 ; col < 7 ; col++){
        for(let ligne = 5 ; ligne >= 0; ligne--){
            if(board[ligne][col] == ' ') boardString += '0'
            else boardString+= board[ligne][col] == 'R' ? 'h' : 'm'
        }
    }
    return boardString;
}

function getIaPlay(){
    let iaPlay = nextMove(convertBoardToMcts())
    return [""+iaPlay[0], ""+iaPlay[1]];
}