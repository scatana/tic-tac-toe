window.onload = () => {
  'use strict';

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js');
  }

  const MAX_TURNS = 9;
  const WINNING_COMBOS = [ 7, 56, 448, 73, 146, 292, 273, 84 ]; // bit masks
  const HINTS = document.getElementById('hints');
  const BUTTON = document.getElementById('new-game');
  const CELLS = document.getElementById('grid').getElementsByTagName('div');

  let currentPlayer, turnNo, moves, gameHasEnded;

  setup();

  BUTTON.addEventListener('click', setup);

  function takeTurn(e) {
    const cell = e.target;
    const cellIndex = parseInt(cell.dataset.index, 10);
    const currentMove = 1 << cellIndex;

    e.preventDefault();
    e.stopPropagation();

    cell.style.backgroundColor = 'transparent';
    cell.removeEventListener('mouseup', takeTurn, true);
    cell.removeEventListener('touchend', takeTurn, true);

    // Only consider unplayed cells
    if (!cell.innerHTML && !gameHasEnded) {
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

        return;
      }
    }

    if (turnNo === MAX_TURNS) {
      HINTS.innerText = 'It\'s a tie!';
      gameHasEnded = true;
    }
  }

  function highlightCell(e) {
    const cell = e.target;

    if (!gameHasEnded) {
      cell.style.backgroundColor = 'rgba(255, 255, 255, .15)';
    }

    cell.removeEventListener('mousedown', highlightCell, true);
    cell.removeEventListener('touchstart', highlightCell, true);
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
      cell.removeEventListener('mousedown', highlightCell, true);
      cell.removeEventListener('touchstart', highlightCell, true);
      cell.removeEventListener('mouseup', takeTurn, true);
      cell.removeEventListener('touchend', takeTurn, true);
      cell.addEventListener('mousedown', highlightCell, true);
      cell.addEventListener('touchstart', highlightCell, true);
      cell.addEventListener('mouseup', takeTurn, true);
      cell.addEventListener('touchend', takeTurn, true);
    }
  }
}
