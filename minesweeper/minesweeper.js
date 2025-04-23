const rows = 5, cols = 5;
const totalMines = 5;
let minesLeft = totalMines;
let gameOver = false;

const boardEl = document.getElementById('board');
const counterEl = document.getElementById('counter');
const gameStatusEl = document.getElementById('game-status');
counterEl.textContent = "Mines left: " + minesLeft;

let board = [];

// Create board cells
for (let i = 0; i < rows; i++) {
  board[i] = [];
  const rowEl = document.createElement('div');
  rowEl.className = 'row';
  for (let j = 0; j < cols; j++) {
    // Each cell tracks whether it is a mine, revealed, flagged, and its adjacent mine count.
    board[i][j] = { mine: false, revealed: false, flagged: false, adjacent: 0 };
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    cellEl.id = `cell-${i}-${j}`;

    cellEl.addEventListener('click', function(e) {
      if (gameOver) return;
      // Use shift+click to toggle flag
      if (e.shiftKey && !board[i][j].revealed) {
        board[i][j].flagged = !board[i][j].flagged;
        cellEl.textContent = board[i][j].flagged ? "🚩" : "";
        // Update global mines counter: decrement when flagging, increment when unflagging.
        if (board[i][j].flagged) {
          minesLeft--;
        } else {
          minesLeft++;
        }
        counterEl.textContent = "Mines left: " + minesLeft;
        checkWin();
        return;
      }
      revealCell(i, j);
    });
    rowEl.appendChild(cellEl);
  }
  boardEl.appendChild(rowEl);
}

// Randomly place mines
let minesToPlace = totalMines;
while (minesToPlace > 0) {
  let i = Math.floor(Math.random() * rows);
  let j = Math.floor(Math.random() * cols);
  if (!board[i][j].mine) {
    board[i][j].mine = true;
    minesToPlace--;
  }
}

// Calculate adjacent mine counts for non‑mine cells.
for (let i = 0; i < rows; i++) {
  for (let j = 0; j < cols; j++) {
    if (!board[i][j].mine) {
      let count = 0;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          let ni = i + x, nj = j + y;
          if (ni >= 0 && ni < rows && nj >= 0 && nj < cols && board[ni][nj].mine) {
            count++;
          }
        }
      }
      board[i][j].adjacent = count;
    }
  }
}

// Reveal cell logic (including flood fill)
function revealCell(i, j) {
  if (i < 0 || i >= rows || j < 0 || j >= cols) return;
  if (board[i][j].revealed || board[i][j].flagged) return;
  board[i][j].revealed = true;
  
  const cellEl = document.getElementById(`cell-${i}-${j}`);
  cellEl.style.background = '#eee';
  if (board[i][j].mine) {
    cellEl.textContent = "💣";
    gameStatusEl.textContent = "Game Over! You hit a mine.";
    gameOver = true;
    return;
  }
  if (board[i][j].adjacent > 0) {
    cellEl.textContent = board[i][j].adjacent;
  } else {
    // Flood fill: reveal neighboring cells if no adjacent mines.
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        if (x === 0 && y === 0) continue;
        revealCell(i + x, j + y);
      }
    }
  }
  checkWin();
}

// Check win condition: all non‑mine cells are revealed.
function checkWin() {
  let win = true;
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      if (!board[i][j].mine && !board[i][j].revealed) {
        win = false;
        break;
      }
    }
    if (!win) break;
  }
  if (win) {
    gameStatusEl.textContent = "Congratulations! You've cleared the board!";
    gameOver = true;
  }
}
