const referee = require("./referee");
const monteCarlo = require("./monteCarlo");

/*
 * Convert the GetEntry to a game board usable by the algorithm.
 */
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

    if (referee.winner(board) !== null)
        throw new Error("Game finished.");

    let resultCoordinates = await monteCarlo.nextMove(board);
    console.log("AI Response with coordinates", resultCoordinates);
    return resultCoordinates[0] + 1; // Column index start at 1.
}

module.exports = {
    askAiToPlay:askAiToPlay
}