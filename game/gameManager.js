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
    return board;
}

function askAiToPlay(b){
    let board = convertEntryToBoard(b);

    return 0;
}

module.exports = {
    askAiToPlay:askAiToPlay
}