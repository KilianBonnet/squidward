const rows = 6;
const columns = 7;
const TIMEOUT = 100;

const emptyTile = '0';
const playerRed = '1';
const playerYellow = '2';


// Store locally the game status
let gameState;
let mcts;

function setup(){
    gameState = Game.start();
    mcts = new MonteCarlo();
}

function nextMove(lastMove){
    return new Promise(function(resolve, reject) {
        if(lastMove ==  null || lastMove === []) {
            resolve([3, 0]); // Haha je suis trop malin
            gameState = Game.nextState(gameState, new Play(3,0));
            return;
        }

        gameState = Game.nextState(gameState, new Play(lastMove[0], lastMove[1]));

        mcts.runSearch(gameState, TIMEOUT);

        let play = mcts.bestPlay(gameState);

        gameState = Game.nextState(gameState, play);

        resolve([play.col, play.row]);
    });
}


/**
 * Class representing a node in the search tree.
 * Stores tree search stats for UCB1.
 */
class MonteCarloNode {
    /**
     * Create a new MonteCarloNode in the search tree.
     * @param {MonteCarloNode} parent - The parent node.
     * @param {Play} play - Last play played to get to this state.
     * @param {State} state - The corresponding state.
     * @param {Play[]} unexpandedPlays - The node's unexpanded child plays.
     */
    constructor(parent, play, state, unexpandedPlays) {
        this.play = play;
        this.state = state;

        // Monte Carlo stuff
        this.n_plays = 0;
        this.n_wins = 0;

        // Tree stuff
        this.parent = parent;
        this.children = new Map();

        for (let play of unexpandedPlays)
            this.children.set(play.hash(), {
                play: play,
                node: null
            });

    }

    /**
     * Get the MonteCarloNode corresponding to the given play.
     * @param {Play} play - The play leading to the child node.
     * @return {MonteCarloNode} The child node corresponding to the play given.
     */
    childNode(play) {
        let child = this.children.get(play.hash());

        if (child === undefined)
            throw new Error("No such play!");

        else if (child.node == null)
            throw new Error("Child is not expanded!");

        return child.node;
    }

    /**
     * Expand the specified child play and return the new child node.
     * Add the node to the array of children nodes.
     * Remove the play from the array of unexpanded plays.
     * @param {Play} play - The play to expand.
     * @param {State} childState - The child state corresponding to the given play.
     * @param {Play[]} unexpandedPlays - The given child's unexpanded child plays; typically all of them.
     * @return {MonteCarloNode} The new child node.
     */
    expand(play, childState, unexpandedPlays) {
        if (!this.children.has(play.hash()))
            throw new Error("No such play!");

        let childNode = new MonteCarloNode(this, play, childState, unexpandedPlays);

        this.children.set(play.hash(), {
            play: play,
            node: childNode
        });

        return childNode;
    }

    /**
     * Get all legal plays from this node.
     * @return {Play[]} All plays.
     */
    allPlays() {
        let ret = [];
        for (let child of this.children.values())
            ret.push(child.play);
        return ret;
    }

    /**
     * Get all unexpanded legal plays from this node.
     * @return {Play[]} All unexpanded plays.
     */
    unexpandedPlays() {
        let unexpanded = [];
        for (let child of this.children.values())
            if (child.node == null) unexpanded.push(child.play)
        return unexpanded;
    }

    /**
     * Whether this node is fully expanded.
     * @return {boolean} Whether this node is fully expanded.
     */
    isFullyExpanded() {
        for (let child of this.children.values())
            if (child.node == null) return false;
        return true;
    }

    /**
     * Whether this node is terminal in the game tree, NOT INCLUSIVE of termination due to winning.
     * @return {boolean} Whether this node is a leaf in the tree.
     */
    isLeaf() {
        return this.children.size === 0;
    }

    /**
     * Get the UCB1 value for this node.
     * @param {number} biasParam - The square of the bias parameter in the UCB1 algorithm, defaults to 2.
     * @return {number} The UCB1 value of this node.
     */
    getUCB1(biasParam) {
        return (this.n_wins / this.n_plays) + Math.sqrt(biasParam * Math.log(this.parent.n_plays) / this.n_plays);
    }
}

/**
 * Class representing the Monte Carlo search tree.
 * Handles the four MCTS steps: selection, expansion, simulation, backpropagation.
 * Handles best-move selection.
 */
class MonteCarlo {
    /**
     * Create a Monte Carlo search tree.
     * @param {number} UCB1ExploreParam - The square of the bias parameter in the UCB1 algorithm; defaults to 2.
     */
    constructor(UCB1ExploreParam = 2) {
        this.UCB1ExploreParam = UCB1ExploreParam;
        this.nodes = new Map(); // map: State.hash() => MonteCarloNode
    }

    /**
     * If state does not exist, create dangling node.
     * @param {State} state - The state to make a dangling node for; its parent is set to null.
     */
    makeNode(state) {
        if (this.nodes.has(state.hash()))
            return;

        let unexpandedPlays = Game.legalPlays(state).slice();
        let node = new MonteCarloNode(null, null, state, unexpandedPlays);
        this.nodes.set(state.hash(), node);
    }

    /**
     * From given state, run as many simulations as possible until the time limit, building statistics.
     * @param {State} state - The state to run the search from.
     * @param {number} timeout - The time to run the simulations for, in seconds.
     * @return {Object} Search statistics.
     */
    runSearch(state, timeout = 95) {
        this.makeNode(state);

        let draws = 0;
        let totalSims = 0;

        let end = Date.now() + timeout;

        while (Date.now() < end) {

            let node = this.select(state)
            let winner = Game.winner(node.state)

            if (node.isLeaf() === false && winner === null) {
                node = this.expand(node);
                winner = this.simulate(node);
            }
            this.backpropagate(node, winner)

            if (winner === 0) draws++
            totalSims++
        }

        return {runtime: timeout, simulations: totalSims, draws: draws}
    }

    /**
     * From the available statistics, calculate the best move from the given state.
     * @param {State} state - The state to get the best play from.
     * @param {string} policy - The selection policy for the "best" play.
     * @return {Play} The best play, according to the given policy.
     */
    bestPlay(state, policy = "robust") {

        this.makeNode(state)
        //If not all children are expanded, not enough information
        if (this.nodes.get(state.hash()).isFullyExpanded() === false)
            throw new Error("Not enough information!")

        let node = this.nodes.get(state.hash())
        let allPlays = node.allPlays()
        let bestPlay

        // Most visits (robust child)
        if (policy === "robust") {
            let max = -Infinity
            for (let play of allPlays) {
                let childNode = node.childNode(play)
                if (childNode.n_plays > max) {
                    bestPlay = play
                    max = childNode.n_plays
                }
            }
        }

        // Highest winrate (max child)
        else if (policy === "max") {
            let max = -Infinity
            for (let play of allPlays) {
                let childNode = node.childNode(play)
                let ratio = childNode.n_wins / childNode.n_plays
                if (ratio > max) {
                    bestPlay = play
                    max = ratio
                }
            }
        }

        return bestPlay
    }

    /**
     * Phase 1: Selection
     * Select until EITHER not fully expanded OR leaf node
     * @param {State} state - The root state to start selection from.
     * @return {MonteCarloNode} The selected node.
     */
    select(state) {
        let node = this.nodes.get(state.hash())
        while (node.isFullyExpanded() && !node.isLeaf()) {
            let plays = node.allPlays()
            let bestPlay
            let bestUCB1 = -Infinity
            for (let play of plays) {
                let childUCB1 = node.childNode(play).getUCB1(this.UCB1ExploreParam)
                if (childUCB1 > bestUCB1) {
                    bestPlay = play
                    bestUCB1 = childUCB1
                }
            }
            node = node.childNode(bestPlay)
        }
        return node
    }

    /**
     * Phase 2: Expansion
     * Of the given node, expand a random unexpanded child node
     * @param {MonteCarloNode} node - The node to expand from. Assume not leaf.
     * @return {MonteCarloNode} The new expanded child node.
     */
    expand(node) {

        let plays = node.unexpandedPlays()
        let index = Math.floor(Math.random() * plays.length)
        let play = plays[index]

        let childState = Game.nextState(node.state, play)
        let childUnexpandedPlays = Game.legalPlays(childState)
        let childNode = node.expand(play, childState, childUnexpandedPlays)
        this.nodes.set(childState.hash(), childNode)

        return childNode
    }

    /**
     * Phase 3: Simulation
     * From given node, play the game until a terminal state, then return winner
     * @param {MonteCarloNode} node - The node to simulate from.
     * @return {string} The winner of the terminal game state.
     */
    simulate(node) {

        let state = node.state
        let winner = Game.winner(state)

        while (winner == null) {
            let plays = Game.legalPlays(state);
            let play = plays[Math.floor(Math.random() * plays.length)];
            state = Game.nextState(state, play);
            winner = Game.winner(state);
        }

        return winner;
    }

    /**
     * Phase 4: Backpropagation
     * From given node, propagate plays and winner to ancestors' statistics
     * @param {MonteCarloNode} node - The node to backpropagate from. Typically leaf.
     * @param {string} winner - The winner to propagate.
     */
    backpropagate(node, winner) {

        while (node !== null) {
            node.n_plays += 1
            // Parent's choice
            if (node.state.isPlayer(winner === playerRed ? playerYellow : playerRed)) {
                node.n_wins += 1
            }
            node = node.parent
        }
    }

    // Utility & debugging methods

    /**
     * Return MCTS statistics for this node and children nodes
     * @param {State} state - The state to get statistics for.
     * @return {Object} The MCTS statistics.
     */
    getStats(state) {
        let node = this.nodes.get(state.hash());

        let stats = {
            n_plays: node.n_plays,
            n_wins: node.n_wins,
            children: []
        }

        for (let child of node.children.values()) {
            if (child.node === null)
                stats.children.push({
                    play: child.play,
                    n_plays: null,
                    n_wins: null
                });
            else
                stats.children.push({
                    play: child.play,
                    n_plays: child.node.n_plays,
                    n_wins: child.node.n_wins
                });
        }
        return stats;
    }
}

/** Class representing the game. */
class Game {
    /** Generate and return the initial game state. */
    static start() {
        let newBoard = [];
        for (let c = 0; c < columns; c++){
            let column = [];
            for (let r = 0; r < rows; r++)
                column.push(emptyTile);
            newBoard.push(column);
        }
        return new State([], newBoard, playerYellow);
    }
    static loadGame(savedBoard) {
        return new State([], savedBoard, playerYellow);
    }

    /** Return the current player's legal plays from given state. */
    static legalPlays(state) {
        let legalPlays = []
        for (let col = 0; col < columns; col++) {
            for (let row = 0; row < rows; row++) {
                if (state.board[col][row] === emptyTile) {
                    legalPlays.push(new Play(col, row));
                    break;
                }
            }
        }
        return legalPlays;
    }

    /** Advance the given state and return it. */
    static nextState(state, play) {
        let newHistory = state.playHistory.slice(); // 1-deep copy
        newHistory.push(play);
        let newBoard = state.board.map((col) => col.slice());
        newBoard[play.col][play.row] = state.player;
        let newPlayer = state.player === playerRed ? playerYellow : playerRed;

        return new State(newHistory, newBoard, newPlayer);
    }

    /** Return the winner of the game. */
    static winner(state) {
        let board = state.board;


        // Horizontally check
        for (let c = 0; c < columns - 3; c++)
            for (let r = 0; r < rows; r++)
                if (board[c][r] !== emptyTile)
                    if (board[c][r] === board[c + 1][r] && board[c][r] === board[c + 2][r] && board[c][r] === board[c + 3][r])
                        return board[c][r];

        // Vertical check
        for (let c = 0; c < columns; c++)
            for (let r = 0; r < rows - 3; r++)
                if (board[c][r] !== emptyTile)
                    if (board[c][r] === board[c][r + 1] && board[c][r] === board[c][r + 2] && board[c][r] === board[c][r + 3])
                        return board[c][r];

        // Diagonal check /
        for (let c = 0; c < columns - 3; c++)
            for (let r = 0; r < rows - 3; r++)
                if (board[c][r] !== emptyTile)
                    if (board[c][r] === board[c + 1][r + 1] && board[c][r] === board[c + 2][r + 2] && board[c][r] === board[c + 3][r + 3])
                        return board[c][r];

        // Diagonal check \
        for (let c = 0; c < columns - 3; c++)
            for (let r = 3; r < rows; r++)
                if (board[c][r] !== emptyTile) {
                    if (board[c][r] === board[c + 1][r - 1] && board[c][r] === board[c + 2][r - 2] && board[c][r] === board[c + 3][r - 3])
                        return board[c][r];
                }

        if(boardIsFull(board)) return 0;
        return null;
    }

}

function boardIsFull(board) {
    for (let c = 0; c < columns; c++){
        for (let r = 0; r < rows; r++)
            if(board[c][r] === emptyTile) return false
    }
    return true;
}
class State {
    constructor(playHistory, board, player) {
        this.playHistory = playHistory;
        this.board = board;
        this.player = player;
    }

    isPlayer(player) {
        return (player === this.player);
    }

    hash() {
        return JSON.stringify(this.playHistory);
    }
}

/** Class representing a state transition. */
class Play {
    constructor(col, row) {
        this.row = row
        this.col = col
    }

    hash() {
        return this.col.toString() + ' ' + this.row.toString();
    }
}

module.exports = {
    nextMove: nextMove,
    setup: setup,
    setupLoad:setupLoad
};