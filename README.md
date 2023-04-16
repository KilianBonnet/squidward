# 🔴 Squidward 🟡
### About
Squidward is a nodeJS REST-API to solve a Connect4 game. Its name comes from the name Squidward from the Spongebob
Squarepants series where the French name of Squidward is Carlo. Carlo refers to Monte Carlo: the algorithm used
by our API to solve the Connect4 problem.

### Authors
- [BONNET Kilian](https://github.com/KilianBonnet)
- [LE BIHAN Léo](https://github.com/LeBihanLeo)
- [BUQUET Antoine](https://github.com/antoinebqt)

## Requirements to run the project
- [NodeJS](https://nodejs.org/en)
- or [Docker](https://www.docker.com/)

## Run the project (NodeJS)
This project needs the [express](http://expressjs.com/) dependency to be run.
- Go the the backend folder
```sh
cd back
```
- Install npm dependencies 
```sh
npm install
```

- Start node project 
```sh
npm start
```
## Run the project (Docker)

- Go the the backend folder
```sh
cd back
```

- Execute the build.sh file to build the docker image
```sh
.\build.sh
```

- Run the backend image as container
```sh
docker compose up -d
```

## Run the project (DockerHub)
```
docker run -d --name Squidward -p 3000:3000 estoult/squidward:1.0
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
| 422         | JSON | { detail : string} | The board configuration was not illegal, however the game is at a state that the AI can't handle (game finished, draw game, not the AI Turn)                                                                      |

