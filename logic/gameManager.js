const referee = require("../game/referee");
const monteCarlo = require("../game/monteCarlo");

/**
 * Convert a given string to a board array
 * Array is 7x6 with the (i,j) indexes representing column i (0 is left) and row j (0 is bottom)
 * 
 * @param {string} boardString 
 * @returns The board array from the converted string
 */
function convertEntryToBoard(boardString){
    const board = [];
    for (let i = 0; i < 7; i++) {
        board[i] = [];
        for (let j = 0; j < 6; j++) {
            board[i][j] = boardString[i * 6 + j];
        }
    }

    return board;
}

/**
 * For a given string b retrieved from the get query parameters,
 * convert the b query to a board array and ask the ai to compute the move
 */
function askAiToPlay(b) {
    let board = convertEntryToBoard(b);

    if (referee.winner(board) !== null)
        throw new Error("Game finished.");

    let resultCoordinates = monteCarlo.nextMove(board);
    console.log("AI Response with coordinates", resultCoordinates);
    return resultCoordinates[0] + 1; // Column index start at 1.
}

module.exports = {
    convertEntryToBoard:convertEntryToBoard,
    askAiToPlay:askAiToPlay
}