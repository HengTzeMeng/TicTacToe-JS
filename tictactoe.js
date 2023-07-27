let gameState;
const currentPlayer = 'X';
const botPlayer = 'O';
let timerId = 0;

const cells = document.getElementsByClassName('cell');
handleRestartGame();

// This function is called to reset the game state and the game board, 
// setting all cells to empty and adding an event listener to each cell to allow players to take their turn.
function handleRestartGame () {

// Set the initial timer value to 0
let timer = 0;
  
// Start the timer
timerId = setInterval(() => {
  // Increase the timer value by 1 every second
  timer += 1;
  // Update the timer display on the page
  document.getElementById('timer').innerHTML = timer;
}, 1000);

  // console.log('Starting Game');
  document.querySelector('.finish--result').style.display = 'none';
  gameState = Array.from(Array(9).keys());
  // console.table(gameState);
  // console.log(cells);
  for(let i=0; i< cells.length; i++) {
    cells[i].innerText = '';
    cells[i].style.removeProperty('background-color');
    cells[i].addEventListener('click', handleTurnClick, false)
  }
};

// This function is called when a player clicks on a cell on the game board. 
// It checks if the selected cell is empty, and if so, places the current player's piece on the board. 
// If the cell is not empty, it displays an alert to the user.
function handleTurnClick (e) {
  // console.log(e.target.id);
  const { id:squareId } = e.target;
  if (typeof gameState[squareId] === 'number') {
    handlePlayerChange(squareId, currentPlayer);
    if (!handleGameTie()) {
      handlePlayerChange(botPicksSpot(), botPlayer)
    }
  } else {
    const message = 'Spot taken, click somewhere else';
    alert(message);
  }
}

const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

// This function is called when a player makes a valid move on the game board. 
// It updates the game state to reflect the player's move and checks if the player has won the game. 
// If the player has won, it calls the handleGameOver function.
function handlePlayerChange (squareId, player) {
  gameState[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let isGameWon = checkPlayerWin(gameState, player);
  // console.log(isGameWon)
  if (isGameWon) {
    handleGameOver(isGameWon);
  }
}

// This function takes the current game state and the current player as inputs, 
// and checks if the current player has won the game. 
// It returns an object containing the index of the winning condition that was met and the player that won the game, 
// or false if the game is not won.
function checkPlayerWin (board, player) {
  let plays = board.reduce((a, e, i) => {
    return (e === player) ? a.concat(i) : a;
  }, []);
  let gameWon = false;
  for (let [index, win] of winningConditions.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) { 
      gameWon = { 
        index: index,
        player: player
      };
      break;
    }
  }
  return gameWon;
}

// This function is called when a player has won the game. 
// It highlights the winning combination on the game board and ends the game by removing the event listener from each cell. 
// It then calls the declareWinner function to display a message to the user.
function handleGameOver ({ index, player }) {
  
 // Stop the timer
 clearInterval(timerId);

  for (let i of winningConditions[index]) {
    const color = (player === currentPlayer) ? 'green' : 'red';
    document.getElementById(i).style.backgroundColor = color;
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener('click', handleTurnClick, false)
  }

  const result = (player === currentPlayer) ? 'You Win' : 'You Lose';
  declareWinner(result);
}

// This function is called when the game has ended and a winner has been determined. 
// It displays a message to the user indicating who won the game.
function declareWinner (who) {
  // console.log('Result: ', who);
  document.querySelector('.finish--result').style.display = 'block';
  document.querySelector('.finish--result .text').innerText = `Result: ${who}`;
}
 
/**
 * Bot moves
 */

// This function returns an array of empty cells on the game board, based on the current game state.
 function emptySquares () {
  return gameState.filter(item => typeof item === 'number');
}

// This function is called to determine the next move for the botPlayer. It simply selects the first empty cell on the game board.
function botPicksSpot () {
  return emptySquares()[0];
}

// This function is called after each player's turn to check if the game has ended in a tie. 
// If the game is tied, it ends the game and displays a message to the user. Otherwise, it returns false.
function handleGameTie () {
  if (emptySquares().length === 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = 'grey';
      cells[i].removeEventListener('click', handleTurnClick, false)
    }
    declareWinner('Draw');
    return true;
  } else {
    return false;
  }
}

