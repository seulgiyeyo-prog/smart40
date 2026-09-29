export type Difficulty = 'easy' | 'medium' | 'hard';

export interface SudokuCell {
  row: number;
  col: number;
  value: number; // 0 represents empty
  solution: number;
  isGiven: boolean; // Initial puzzle clue
  notes: number[]; // Pencil marks (1-9)
  isError: boolean;
}

export type SudokuBoard = SudokuCell[][];

export interface SudokuMoveHistory {
  row: number;
  col: number;
  prevValue: number;
  newValue: number;
  prevNotes: number[];
  newNotes: number[];
}

export interface SudokuGameStats {
  easyBestTime: number | null;
  mediumBestTime: number | null;
  hardBestTime: number | null;
  gamesCompleted: number;
}
