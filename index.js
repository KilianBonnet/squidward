const express = require('express');
const {askAiToPlay} = require("./game/gameManager");

const app = express();

app.get('/move', (req, res) => {
    const boardContent = req.query['b'];



    res.status(200).json({column:askAiToPlay(boardContent)});
});

app.listen(3000, () => {
    console.log('Server started on port 3000...');
});