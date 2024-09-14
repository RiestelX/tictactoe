const translations = {
    en: {
      title: "Tic-Tac-Toe",
      playerVsPlayer: "PvP",
      playerVsBot: "AI",
      easy: "Easy",
      hard: "Impossible",
      resetBoard: "Reset",
      switchLanguage: "日本語",
      win: "Player {winner} wins!",
      draw: "It's a draw!",
    },
    ja: {
      title: "三目並べ",
      playerVsPlayer: "対戦",
      playerVsBot: "AI",
      easy: "低",
      hard: "高",
      resetBoard: "リセット",
      switchLanguage: "ENGLISH",
      win: "プレイヤー{winner}の勝利!",
      draw: "引き分けです!",
    }
  };
  
  function updateLanguage(lang) {
    document.querySelector("html").setAttribute("lang", lang);
    document.querySelector("h1").textContent = translations[lang].title;
    document.querySelector(".selection button:nth-child(1)").textContent = translations[lang].playerVsPlayer;
    document.querySelector(".selection button:nth-child(2)").textContent = translations[lang].playerVsBot;
    document.querySelector(".difficulty button:nth-child(1)").textContent = translations[lang].easy;
    document.querySelector(".difficulty button:nth-child(2)").textContent = translations[lang].hard;
    document.querySelector(".controls button:nth-child(1)").textContent = translations[lang].resetBoard;
    document.querySelector(".language-switch").textContent = translations[lang].switchLanguage;
  }
  
  function switchLanguage() {
    const currentLang = document.querySelector("html").getAttribute("lang");
    const newLang = currentLang === "en" ? "ja" : "en";
    updateLanguage(newLang);
  }
  
  updateLanguage("ja");
  

let gameMode = 'bot';
let difficulty = 'easy';

function setMode(mode) {
  gameMode = mode;
  resetBoard();

  const buttons = document.querySelectorAll(".selection button");
  buttons.forEach((button) => {
    if (button.getAttribute("onclick") === `setMode('${mode}')`) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
  const difficultyContainer = document.getElementById('difficulty-container');
  if (gameMode === 'bot') {
      difficultyContainer.style.display = 'flex';
  } else {
      difficultyContainer.style.display = 'none';
  }

  console.log(mode);
}

function setDifficulty(diff) {
  difficulty = diff;
  const buttons = document.querySelectorAll(".difficulty button");
  buttons.forEach((button) => {
    if (button.getAttribute("onclick") === `setDifficulty('${diff}')`) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
  console.log(diff);
}

let board = [
  ['', '', ''],
  ['', '', ''],
  ['', '', '']
];

let currentPlayer = 'X';

function makeMove(row, col) {
    if (board[row][col] === '' && gameMode) {
        board[row][col] = currentPlayer;
        render();

        if (checkWin()) {
            const lang = document.querySelector("html").getAttribute("lang");
            const winText = translations[lang].win.replace("{winner}", currentPlayer);
            document.getElementById("game-result").textContent = winText;
            resetBoard();
            return;
        } else if (checkDraw()) {
            const lang = document.querySelector("html").getAttribute("lang");
            const drawText = translations[lang].draw;
            document.getElementById("game-result").textContent = drawText;
            resetBoard();
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        if (gameMode === 'bot' && currentPlayer === 'O') {
            botMove();
        }
    }
}



function botMove() {
  if (difficulty === "hard") {
    const { row, col } = minimaxAlphaBeta(board, "O", -Infinity, Infinity);
    makeMove(row, col);
  } else {
    const emptyCells = getEmptyCells(board);
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const [row, col] = emptyCells[randomIndex];
      makeMove(row, col);
    }
  }
}

function getEmptyCells(board) {
  const emptyCells = [];
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === "") {
        emptyCells.push([row, col]);
      }
    }
  }
  return emptyCells;
}

function minimaxAlphaBeta(board, player, alpha = -Infinity, beta = Infinity) {
    const winner = checkWin(board);
    if (winner === "X") return { score: -10 };
    if (winner === "O") return { score: 10 };
    if (getEmptyCells(board).length === 0) return { score: 0 };
  
    const moves = [];
    const emptyCells = getEmptyCells(board);
    for (const [row, col] of emptyCells) {
      const currentBoard = JSON.parse(JSON.stringify(board));
      currentBoard[row][col] = player;
      const result = minimaxAlphaBeta(currentBoard, player === "O" ? "X" : "O", alpha, beta);
      moves.push({ row, col, score: result.score });
      if (player === "O") {
        alpha = Math.max(alpha, result.score);
      } else {
        beta = Math.min(beta, result.score);
      }
      if (beta <= alpha) break;
    }
    let bestMove;
    if (player === "O") {
      let bestScore = -Infinity;
      for (const move of moves) {
        if (move.score > bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    } else {
      let bestScore = Infinity;
      for (const move of moves) {
        if (move.score < bestScore) {
          bestScore = move.score;
          bestMove = move;
        }
      }
    }
    return { row: bestMove.row, col: bestMove.col, score: bestMove.score };
  }
  
  function updateDifficultyButtons() {
    const isEmpty = board.every(row => row.every(cell => cell === ''));

    const difficultyButtons = document.querySelectorAll(".difficulty button");
    difficultyButtons.forEach(button => {
        button.disabled = !isEmpty;
    });
}

function render() {
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    const cell = document.querySelector(
      `.game-board .cell[style*="grid-row:${row + 1};"][style*="grid-column:${col + 1};"]`
    );
    cell.innerText = board[row][col];
    if (board[row][col]) {
      cell.setAttribute("data-filled", board[row][col]);
    } else {
      cell.removeAttribute("data-filled");
    }
  }
}
updateDifficultyButtons();
}

function checkWin(localBoard = board) {
for (let row = 0; row < 3; row++) {
  if (
    localBoard[row][0] === localBoard[row][1] &&
    localBoard[row][1] === localBoard[row][2] &&
    localBoard[row][0] !== ""
  ) {
    return localBoard[row][0];
  }
}
for (let col = 0; col < 3; col++) {
  if (
    localBoard[0][col] === localBoard[1][col] &&
    localBoard[1][col] === localBoard[2][col] &&
    localBoard[0][col] !== ""
  ) {
    return localBoard[0][col];
  }
}
if (
  localBoard[0][0] === localBoard[1][1] &&
  localBoard[1][1] === localBoard[2][2] &&
  localBoard[0][0] !== ""
) {
  return localBoard[0][0];
}
if (
  localBoard[0][2] === localBoard[1][1] &&
  localBoard[1][1] === localBoard[2][0] &&
  localBoard[0][2] !== ""
) {
  return localBoard[0][2];
}
return null;
}

function checkDraw() {
for (let row = 0; row < 3; row++) {
  for (let col = 0; col < 3; col++) {
    if (board[row][col] === "") {
      return false;
    }
  }
}
return true;
}

function resetBoard(done) {
    if (done === 'done') {
        document.getElementById("game-result").textContent = "";
    }
    board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', '']
    ];
    currentPlayer = 'X';
    render();
}

render();
