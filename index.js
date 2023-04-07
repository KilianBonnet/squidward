const express = require('express');
const gameManager = require("./game/gameManager");
const inputManager = require("./logic/inputManager");

/**
 * Handle a GET /move request with the board b as parameters 
 * @param {*} req The HTTP client request
 * @param {*} res The HTTP server response
 * @returns Server response
 */
async function proceedMoveRequest(req, res) {
    console.log("\nReceiving /move request");

    const boardContent = req.query['b'];

    if (!inputManager.isValid(boardContent))
        return res.status(400).send("Invalid Format");

    if(!inputManager.isLegal(boardContent))
        return res.status(400).send("Illegal board");

    let hmRatio = inputManager.countHMRatio(boardContent);
    if(hmRatio === 0) res.status(422).json({detail: "Not the turn of the AI."});
    if(hmRatio > 1 || hmRatio < 0) return res.status(400).send("Illegal board");

    try {
        let columnToPlay = await gameManager.askAiToPlay(boardContent);
        res.status(200).json({column: columnToPlay});
    } catch (e) {
        res.status(422).json({detail: e.message});
    }
}

const app = express();                                                  // Create express app
app.get('/move', async (req, res) => proceedMoveRequest(req, res));     // Handling /move GET requests
app.listen(3000, () => console.log('Server started on port 3000...'));  // Exposing app on server 3000