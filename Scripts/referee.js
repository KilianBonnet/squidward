
/**
 * For a given board, check if the game has a winner
 * @param board The board to check if there is a winner
 * @returns 0 if game is full, 1 if red win, 2 if yellow win
 */
/** Return the winner of the game. */
function winnerFinder(board) {
    if(isBoardFull(board)) return 0;

    // Horizontally check
    for (let c = 0; c < COLUMNS - 3; c++)
        for (let r = 0; r < ROWS; r++)
            if (board[c][r] !== EMPTY_TILE)
                if (board[c][r] === board[c + 1][r] && board[c][r] === board[c + 2][r] && board[c][r] === board[c + 3][r])
                    return board[c][r];

    // Vertical check
    for (let c = 0; c < COLUMNS; c++)
        for (let r = 0; r < ROWS - 3; r++)
            if (board[c][r] !== EMPTY_TILE)
                if (board[c][r] === board[c][r + 1] && board[c][r] === board[c][r + 2] && board[c][r] === board[c][r + 3])
                    return board[c][r];

    // Diagonal check /
    for (let c = 0; c < COLUMNS - 3; c++)
        for (let r = 0; r < ROWS - 3; r++)
            if (board[c][r] !== EMPTY_TILE)
                if (board[c][r] === board[c + 1][r + 1] && board[c][r] === board[c + 2][r + 2] && board[c][r] === board[c + 3][r + 3])
                    return board[c][r];

    // Diagonal check \
    for (let c = 0; c < COLUMNS - 3; c++)
        for (let r = 3; r < ROWS; r++)
            if (board[c][r] !== EMPTY_TILE)
                if (board[c][r] === board[c + 1][r - 1] && board[c][r] === board[c + 2][r - 2] && board[c][r] === board[c + 3][r - 3])
                    return board[c][r];

    return null;
}

function isBoardFull(board) {
    for (let c = 0; c < COLUMNS; c++){
        for (let r = 0; r < ROWS; r++)
            if(board[c][r] === EMPTY_TILE) return false
    }
    return true;
}
