# 🔴 Squidward 🟡
A nodeJS API to solve a Connect4 game.

- BONNET Kilian
- LE BIHAN Léo
- BUQUET Antoine

## Requirements to run the project
- A computer
- NodeJS

## Run the project
This project needs the express dependency to be run.
```
>>> npm install
>>> npm start
```


# Api Documentation
## /GET /move?b=<board-content>
### Query syntax
The query argument `b` provides the current contents of the game board, using the following conventions:
- String of 42 characters
- The string should be built by scanning in column, starting from the bottom left corner
- Each character is taken among:

| Character | Representation      |
|-----------|---------------------|
| 0 (zero)  | Empty cell          |
| h         | Human player's tile |
| m         | AI's tile           |

For instance, the string `m00000h00000mm0000hmh000h00000h00000000000` represents the following board:
```
. . . . . . .
. . . . . . .
. . . . . . .
. . . h . . .
. . m m . . .
m h m h h h .
```
### Return code
| Return Code | Type | Data               | Description                                                                                                                                                                                                       |
|-------------|------|--------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 200 (OK)    | JSON | { column : int }   | `Column` contains an integer representing the number of the column to be played, **counted from 1**                                                                                                               |
| 400         | Text | Error message      | `Invalid Format` : The board string is malformed (empty string, wrong size, bad characters) <br> `Illegal board`: The given board is legal but has an illegal configuration (Wrong h/m tile ratio, floating tile) |
| 422         | JSON | { detail : string} | The board configuration was not illegal, however the game is at a state that the AI can't handle (game finished, draw game)                                                                                       |

