const boardElement = document.getElementById("sudoku-board");

function createEmptyBoard() {
    return new Array(9).fill(0).map(() => new Array(9).fill(0));
}

// Check if a number is safe in a position
function isSafe(board, row, col, num) {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num || board[i][col] === num) return false;
    }

    let startRow = row - row % 3, startCol = col - col % 3;
    for (let i = 0; i < 3; i++)
        for (let j = 0; j < 3; j++)
            if (board[i + startRow][j + startCol] === num) return false;

    return true;
}

// Backtracking function to fill the Sudoku board
function solveSudoku(board) {
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            if (board[row][col] === 0) {
                for (let num = 1; num <= 9; num++) {
                    if (isSafe(board, row, col, num)) {
                        board[row][col] = num;
                        if (solveSudoku(board)) return true;
                        board[row][col] = 0;
                    }
                }
                return false;
            }
        }
    }
    return true;
}

// Generate a random valid Sudoku board
function generateFullSudoku() {
    let board = createEmptyBoard();
    solveSudoku(board);
    return board;
}

// Remove some numbers to create a puzzle
function removeNumbers(board, difficulty = 40) {
    let puzzle = board.map(row => [...row]); // Clone the board
    let attempts = difficulty;

    while (attempts > 0) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);

        if (puzzle[row][col] !== 0) {
            puzzle[row][col] = 0;
            attempts--;
        }
    }
    return puzzle;
}

// Create Sudoku Grid
function displayBoard(board) {
    boardElement.innerHTML = ""; // Clear previous board
    for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
            let input = document.createElement("input");
            input.type = "text";
            input.maxLength = 1;

            if (board[row][col] !== 0) {
                input.value = board[row][col];
                input.disabled = true;
            }

            input.dataset.row = row;
            input.dataset.col = col;
            input.addEventListener("input", validateInput);

            boardElement.appendChild(input);
        }
    }
}

// Validate user input
function validateInput(event) {
    let value = event.target.value;
    if (!/^[1-9]?$/.test(value)) {
        event.target.value = "";
    }
}

// Generate and display a new Sudoku puzzle
function generateSudoku() {
    let fullBoard = generateFullSudoku();
    let puzzle = removeNumbers(fullBoard, 40); // Adjust difficulty by changing the number of blanks
    displayBoard(puzzle);
}

// Generate a puzzle when the page loads
generateSudoku();