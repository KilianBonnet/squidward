const referee = require("../game/referee");
const randomAi = require("../game/randomAi")
const gameManager = require("./gameManager");
const monteCarlo = require("../game/monteCarlo");

/**
 * 
 * @param {string} algorithm The algorithm to face
 * @param {int} rounds The number of match tha Montecarlo algorithm will face the given algorithm
 * @param {int} timePerMove The time Montecarlo has to proceed a move
 */
function benchmark(algorithm, rounds, timePerMove = 100) {
    console.log("Starting benchmarking vs " + algorithm + " (" + rounds + " rounds, " + timePerMove + "ms per move)")
    let stats = {
        'wins' : 0,
        'loses' : 0,
        'draws' : 0,
        'errors' : 0
    }

    for(let i = 0; i < rounds; i++) {
        process.stdout.write("\rRunning round " + (i + 1) + "...");

        // Simulate game for the given algorithm
        let gameResult;
        if(algorithm === "random") gameResult = simulateRandomAiMatch();

        switch (gameResult){
            case null : 
                stats.errors += 1;
                break;
            case 0:
                stats.draws += 1;
                break;
            case 'h':
                stats.loses += 1;
                break;
            case 'm':
                stats.wins += 1;
                break;
        }
    }
    
    return stats;
}

/**
 * Simulate a game versus the random AI algorithm
 * @returns 0 draw, 'h' random algorithm wins, 'm' Monteccarlo win
 */
function simulateRandomAiMatch(timePerMove){
    const b = "000000000000000000000000000000000000000000";
    let board = gameManager.convertEntryToBoard(b);
    let winner;
    while((winner = referee.winner(board)) === null) {
        if(winner === 0) break;
    
        let move = randomAi.nextMove(board);
        board[move[0]][move[1]] = 'h';
        move = monteCarlo.nextMove(board, timePerMove);
        board[move[0]][move[1]] = 'm';
    }

    return winner;
}


module.exports = {
    benchmark:benchmark
};

