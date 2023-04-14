const ROWS = 6;
const COLUMNS = 7;

const EMPTY_TILE = '0';

function nextMove(board){
    let possibleCoordsToPlay = [];
    for(let col = 0; col < COLUMNS; col++)
        for(let row = 0; row < ROWS; row++)
            if(board[col][row] === EMPTY_TILE) {
                possibleCoordsToPlay.push([col, row]);
                break;
            }
    return possibleCoordsToPlay[Math.floor(Math.random() * board.length)];
}

module.exports = {
    nextMove:nextMove
};