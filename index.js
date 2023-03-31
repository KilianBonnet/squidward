const express = require('express');
const gameManager = require("./game/gameManager");
const inputManager = require("./logic/inputManager");

const app = express();

app.get('/move', async (req, res) => {
    const boardContent = req.query['b'];

    if (!inputManager.isValid(boardContent)) {
        return res.status(400).send("Invalid Format");
    }

    if(!inputManager.isLegal(boardContent)) {
        return res.status(400).send("Illegal board");
    }

    try {
        let columnToPlay = await gameManager.askAiToPlay(boardContent);
        res.status(200).json({column: columnToPlay});
    } catch (e) {
        res.status(422).json({detail: e.message});
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});