const express = require('express');
const {askAiToPlay} = require("./game/gameManager");

const app = express();

app.get('/move', (req, res) => {
    const boardContent = req.query['b'];

    // Check if boardContent string contains other character than m h 0 or if boardContent string has not 42 characters
    if (boardContent == null || boardContent.length !== 42 || !/^[mh0]+$/.test(boardContent)) {
        return res.status(400).send("Invalid Format");
    }

    try {
        res.status(200).json({column:askAiToPlay(boardContent)});
    } catch (e) {
        res.status(422).json({detail:e.message});
    }

});

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});