# 🔴 Squidward 🟡
A nodeJS API to solve a Connect4 game.

## Requirements to run the project
- NodeJS

## Run the project
```js
>>> npm start
```

## Api
### /GET /move?b=<board-content>
The query argument `b` provides the current contents of the game board, using the following conventions:
- String of 42 characters
- The string should be built by scanning in column, starting from the bottom left corner
- Each character is taken among:

| Character | Representation      |
|-----------|---------------------|
| 0 (zero)  | Empty cell          |
| h         | Human player's tile |
| m         | AI's tile           |
