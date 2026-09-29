import { Difficulty, SudokuBoard } from '../types/sudoku';

// Check if placing val at (r, c) is valid according to Sudoku rules
function isValid(grid: number[][], r: number, c: number, val: number): boolean {
  for (let i = 0; i < 9; i++) {
    if (grid[r][i] === val) return false;
    if (grid[i][c] === val) return false;
  }
  const br = Math.floor(r / 3) * 3;
  const bc = Math.floor(c / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[br + i][bc + j] === val) return false;
    }
  }
  return true;
}

// Backtracking solver with randomized candidate selection
function solveRandom(grid: number[][]): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
        for (const n of nums) {
          if (isValid(grid, r, c, n)) {
            grid[r][c] = n;
            if (solveRandom(grid)) return true;
            grid[r][c] = 0;
          }
        }
        return false;
      }
    }
  }
  return true;
}

// Count number of solutions (stops early at 2 to verify uniqueness)
function countSolutions(grid: number[][], counter = { val: 0 }): number {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      if (grid[r][c] === 0) {
        for (let n = 1; n <= 9; n++) {
          if (isValid(grid, r, c, n)) {
            grid[r][c] = n;
            countSolutions(grid, counter);
            grid[r][c] = 0;
            if (counter.val >= 2) return counter.val;
          }
        }
        return counter.val;
      }
    }
  }
  counter.val++;
  return counter.val;
}

// Generate a 100% mathematically valid, uniquely solvable Sudoku puzzle
export function generateSudokuPuzzle(difficulty: Difficulty): {
  initialBoard: SudokuBoard;
  solution: number[][];
} {
  const grid: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));

  // 1. Fill the three diagonally independent 3x3 blocks (top-left, center, bottom-right)
  // Since they are diagonally disjoint, their numbers never conflict
  for (let k = 0; k < 9; k += 3) {
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
    let idx = 0;
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        grid[k + r][k + c] = nums[idx++];
      }
    }
  }

  // 2. Solve the rest of the board using backtracking
  solveRandom(grid);

  // Store the 100% verified full solution
  const solution: number[][] = grid.map(row => [...row]);
  const puzzle: number[][] = solution.map(row => [...row]);

  // 3. Determine number of clues to keep based on difficulty
  // Easy: ~42 clues (39 empty)
  // Medium: ~34 clues (47 empty)
  // Hard: ~28 clues (53 empty)
  const cluesToKeep = difficulty === 'easy' ? 42 : difficulty === 'medium' ? 34 : 28;
  const targetRemove = 81 - cluesToKeep;

  const positions: [number, number][] = [];
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      positions.push([r, c]);
    }
  }
  positions.sort(() => Math.random() - 0.5);

  let removed = 0;
  for (const [r, c] of positions) {
    if (removed >= targetRemove) break;

    const temp = puzzle[r][c];
    puzzle[r][c] = 0;

    // Verify the puzzle remains uniquely solvable
    const copy = puzzle.map(row => [...row]);
    const counter = { val: 0 };
    countSolutions(copy, counter);

    // If removing this clue causes ambiguity (multiple solutions), restore it
    if (counter.val !== 1) {
      puzzle[r][c] = temp;
    } else {
      removed++;
    }
  }

  // 4. Construct rich SudokuBoard with guaranteed solution integrity
  const initialBoard: SudokuBoard = puzzle.map((row, r) =>
    row.map((val, c) => ({
      row: r,
      col: c,
      value: val,
      solution: solution[r][c],
      isGiven: val !== 0,
      notes: [],
      isError: false
    }))
  );

  return { initialBoard, solution };
}

// Validate board for duplicate conflicts in row, col, or 3x3 box
export function validateBoardErrors(board: SudokuBoard): SudokuBoard {
  return board.map((row, r) =>
    row.map((cell, c) => {
      if (cell.value === 0) return { ...cell, isError: false };

      let hasConflict = false;

      // Row check
      for (let col = 0; col < 9; col++) {
        if (col !== c && board[r][col].value === cell.value) {
          hasConflict = true;
          break;
        }
      }

      // Column check
      if (!hasConflict) {
        for (let rowIdx = 0; rowIdx < 9; rowIdx++) {
          if (rowIdx !== r && board[rowIdx][c].value === cell.value) {
            hasConflict = true;
            break;
          }
        }
      }

      // 3x3 Box check
      if (!hasConflict) {
        const startR = Math.floor(r / 3) * 3;
        const startC = Math.floor(c / 3) * 3;
        for (let br = 0; br < 3; br++) {
          for (let bc = 0; bc < 3; bc++) {
            const curR = startR + br;
            const curC = startC + bc;
            if ((curR !== r || curC !== c) && board[curR][curC].value === cell.value) {
              hasConflict = true;
              break;
            }
          }
          if (hasConflict) break;
        }
      }

      return { ...cell, isError: hasConflict };
    })
  );
}

// Check if Sudoku is completely solved
export function isSudokuSolved(board: SudokuBoard): boolean {
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const cell = board[r][c];
      if (cell.value === 0 || cell.value !== cell.solution || cell.isError) {
        return false;
      }
    }
  }
  return true;
}

// Format seconds into MM:SS
export function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
