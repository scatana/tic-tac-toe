window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }

  const MAX_TURNS = 9;
  const WINNING_COMBOS = [ 7, 56, 448, 73, 146, 292, 273, 84 ]; // bit masks
  const HINTS = document.getElementById('hints');
  const GRID = document.getElementById('grid');
  const CELLS = GRID.getElementsByTagName('div');
  const OVERLAY = document.getElementById('overlay');
  const BUTTON = document.getElementById('new-game');

  let currentPlayer, turnNo, moves, gameHasEnded;

  setup();

  GRID.addEventListener('click', e => {
    !gameHasEnded && takeTurn(e);
  });
  BUTTON.addEventListener('click', setup);

  function takeTurn(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.dataset.index, 10);
    const currentMove = 1 << cellIndex;

    // Only consider unplayed cells
    if (!cell.innerHTML) {
      cell.innerHTML = currentPlayer;
      moves[currentPlayer] |= currentMove;

      // There is no point in checking for win conditions before
      // turn 5 because there are not enough moves for winning
      if (turnNo > 4) {
        checkWinCondition(currentPlayer)
      }

      if (!gameHasEnded) {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        HINTS.innerText = `Next move: ${currentPlayer}`;
        turnNo++;
      }
    }
  }

  function checkWinCondition(player) {
    for (let combo of WINNING_COMBOS) {
      if (combo === (combo & moves[player])) {
        HINTS.innerText = player + ' won!';
        gameHasEnded = true;

        // Highlight the winning combination
        for (let cell of CELLS) {
          const cellIndex = parseInt(cell.dataset.index, 10);
          const cellMask = 1 << cellIndex;
          if (cellMask === (cellMask & combo)) {
            cell.style.backgroundColor = 'rgba(255, 255, 255, .15)';
          }
        }

        break;
      }
    }

    if (turnNo === MAX_TURNS) {
      HINTS.innerText = 'It\'s a tie!';
      gameHasEnded = true;
    }
  }

  function setup() {
    currentPlayer = 'X';
    turnNo = 1;
    moves = {
      X: 0,
      O: 0
    };
    gameHasEnded = false;

    HINTS.innerText = `Next move: ${currentPlayer}`;

    for (let cell of CELLS) {
      cell.innerHTML = '';
      cell.style.backgroundColor = 'transparent';
    }
  }
}
