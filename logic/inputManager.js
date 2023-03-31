/*
 * This function make sure that boardContent:
 * - Is not null
 * - Contains 42 characters
 * - Contains only 'm','h' and '0', characters
 */
function isValid(boardContent){
    return boardContent != null && boardContent.length === 42 && /^[mh0]+$/.test(boardContent)
}


/*
 * This function make sure that boardContent:
 * - Has a legal h/m tile ratio
 * - Has no floating tile
 */
function isLegal(boardContent){
    return isHMRatioLegal(boardContent) && areTilesLegal(boardContent);
}

/**
 * [HELPER] This function make sure that there is no floating tile.
 * @param boardContent The game board to check
 * @returns {boolean} Whether or not the there is no floating tile.
 */
function areTilesLegal(boardContent){
    const ROWS = 6;
    const EMPTY_TILE = '0';

    for(let i = 0; i < boardContent.length; i++)
        if(i % ROWS !== 0 && boardContent[i] !== EMPTY_TILE && boardContent[i - 1] === EMPTY_TILE)
            return false;

    return true;
}

/**
 * [HELPER] Check if the h/m tile ratio is legal
 * @param boardContent The game board to check
 * @returns {boolean} Whether or not the h/m tile ratio is legal
 */
function isHMRatioLegal(boardContent){
    let mhDelta = 0;
    for (let i = 0; i < boardContent.length; i++) {
        if(boardContent[i] === 'm') mhDelta++;
        else if (boardContent[i] === 'h') mhDelta--;
    }
    return Math.abs(mhDelta) <= 1;
}

module.exports = {
    isValid:isValid,
    isLegal:isLegal
}