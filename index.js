const express = require('express');
const gameManager = require("./game/gameManager");

const app = express();

app.get('/move', async (req, res) => {
    const boardContent = req.query['b'];

    /*
     * After this if statement we are sure that boardContent:
     * - Is not null
     * - Contains 42 characters
     * - Contains only 'm','h' and '0', characters
     */
    if (boardContent == null || boardContent.length !== 42 || !/^[mh0]+$/.test(boardContent)) {
        return res.status(400).send("Invalid Format");
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