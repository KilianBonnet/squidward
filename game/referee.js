const ROWS = 6;
const COLUMNS = 7;
const EMPTY_TILE = "0";

/**
 * For a given board, check if the game has a winner
 * @param board The board to check if there is a winner
 * @returns {boolean} If there is a winner
 */
function checkWinner(board) {
    // Horizontally check (|)
    for (let c = 0; c < COLUMNS - 3; c++)
        for (let r = 0; r < ROWS; r++)
            if (board[c][r] !== EMPTY_TILE)
                if (board[c][r] === board[c + 1][r] && board[c][r] === board[c + 2][r] && board[c][r] === board[c + 3][r])
                    return true;

    // Vertical check (-)
    for (let c = 0; c < COLUMNS; c++)
        for (let r = 0; r < ROWS - 3; r++)
            if (board[c][r] !== EMPTY_TILE)
                if (board[c][r] === board[c][r + 1] && board[c][r] === board[c][r + 2] && board[c][r] === board[c][r + 3])
                    return true;

    // Diagonal check (/)
    for (let c = 0; c < COLUMNS - 3; c++)
        for (let r = 0; r < ROWS - 3; r++)
            if (board[c][r] !== EMPTY_TILE)
                if (board[c][r] === board[c + 1][r + 1] && board[c][r] === board[c + 2][r + 2] && board[c][r] === board[c + 3][r + 3])
                    return true;

    // Diagonal check (\)
    for (let c = 0; c < COLUMNS - 3; c++)
        for (let r = 3; r < ROWS; r++)
            if (board[c][r] !== EMPTY_TILE){
                if (board[c][r] === board[c + 1][r - 1] && board[c][r] === board[c + 2][r - 2] && board[c][r] === board[c + 3][r - 3])
                    return true;
            }

    return false;
}

module.exports = {
    checkWinner: checkWinner
};