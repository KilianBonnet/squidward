const referee = require("./referee");

/*
 * Convert the GetEntry to a game board usable by the algorithm.
 */
const {setup, nextMove} = require("./monteCarlo");

let lastMove;

function convertEntryToBoard(boardString){
    const board = [];
    for (let i = 0; i < 7; i++) {
        board[i] = [];
        for (let j = 0; j < 6; j++) {
            board[i][j] = boardString[i * 6 + j];
        }
    }
    console.log("Board string: " + boardString + "\nBoard converted: ");
    console.log(board);
    return board;
}

async function askAiToPlay(b) {
    let board = convertEntryToBoard(b);
    if (referee.checkWinner(board))
        throw new Error("Game finished.");

    setup();
    let result;
    if (isFirstMove(b)) {
        result = await nextMove(null);
    } else {
        result = await nextMove(lastMove);
    }
    lastMove = result;

    return result;
}


    function isFirstMove(b) {
    return /^0+$/.test(b);
}

module.exports = {
    askAiToPlay:askAiToPlay
}