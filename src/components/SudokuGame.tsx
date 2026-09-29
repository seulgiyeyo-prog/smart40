import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Difficulty, SudokuBoard, SudokuMoveHistory } from '../types/sudoku';
import {
  generateSudokuPuzzle,
  validateBoardErrors,
  isSudokuSolved,
  formatTime
} from '../utils/sudokuGenerator';
import { soundManager } from '../utils/audio';
import {
  Play,
  Pause,
  RotateCcw,
  Pencil,
  Eraser,
  Undo2,
  Lightbulb,
  Trophy,
  Clock,
  Sparkles,
  Check,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  Zap,
  Eye,
  CheckCheck
} from 'lucide-react';

interface SudokuGameProps {
  externalLargeFont?: boolean;
}

export const SudokuGame: React.FC<SudokuGameProps> = ({ externalLargeFont = false }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [board, setBoard] = useState<SudokuBoard>([]);
  const [selectedCell, setSelectedCell] = useState<[number, number] | null>([0, 0]);
  const [isNoteMode, setIsNoteMode] = useState<boolean>(false);
  const [history, setHistory] = useState<SudokuMoveHistory[]>([]);
  const [mistakes, setMistakes] = useState<number>(0);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const [showSolutionModal, setShowSolutionModal] = useState<boolean>(false);

  // Settings
  const [highlightDuplicates, setHighlightDuplicates] = useState<boolean>(true);
  const [instantErrorCheck, setInstantErrorCheck] = useState<boolean>(true);

  // Best times stored in localStorage
  const [bestTimes, setBestTimes] = useState<Record<Difficulty, number | null>>(() => {
    try {
      const saved = localStorage.getItem('sudoku_best_times_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return { easy: null, medium: null, hard: null };
  });

  // Start new round
  const startNewGame = useCallback((diff: Difficulty = difficulty) => {
    soundManager.playCardSlap();
    const { initialBoard } = generateSudokuPuzzle(diff);
    setBoard(initialBoard);
    setSelectedCell([0, 0]);
    setIsNoteMode(false);
    setHistory([]);
    setMistakes(0);
    setHintsUsed(0);
    setTimeElapsed(0);
    setIsPaused(false);
    setIsCompleted(false);
    setShowSolutionModal(false);

    const diffKor = diff === 'easy' ? '쉬움' : diff === 'medium' ? '보통' : '어려움';
    soundManager.speak(`${diffKor} 난이도 스도쿠 퍼즐이 시작되었습니다.`);
  }, [difficulty]);

  // Auto-solve the current puzzle using the verified unique solution
  const handleAutoSolve = () => {
    soundManager.playVictorySound();
    const solvedBoard = board.map(row =>
      row.map(cell => ({
        ...cell,
        value: cell.solution,
        notes: [],
        isError: false
      }))
    );
    setBoard(solvedBoard);
    setShowSolutionModal(false);
    setIsCompleted(true);
  };

  useEffect(() => {
    startNewGame(difficulty);
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer loop
  useEffect(() => {
    if (isPaused || isCompleted || board.length === 0) return;
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, isCompleted, board.length]);

  // Handle cell click
  const handleCellClick = (r: number, c: number) => {
    if (isPaused || isCompleted) return;
    soundManager.playCardSlap();
    setSelectedCell([r, c]);
  };

  // Place number or toggle pencil note
  const handleInputNumber = (num: number) => {
    if (!selectedCell || isPaused || isCompleted) return;
    const [r, c] = selectedCell;
    const currentCell = board[r][c];

    // Cannot overwrite initial puzzle clues
    if (currentCell.isGiven) return;

    // 1. Pencil note mode
    if (isNoteMode) {
      soundManager.playPencilSound();
      const currentNotes = currentCell.notes;
      const newNotes = currentNotes.includes(num)
        ? currentNotes.filter(n => n !== num)
        : [...currentNotes, num].sort((a, b) => a - b);

      setHistory(prev => [
        ...prev,
        {
          row: r,
          col: c,
          prevValue: currentCell.value,
          newValue: currentCell.value,
          prevNotes: [...currentCell.notes],
          newNotes: [...newNotes]
        }
      ]);

      const newBoard = board.map((row, rowIdx) =>
        row.map((cell, colIdx) => {
          if (rowIdx === r && colIdx === c) {
            return { ...cell, notes: newNotes };
          }
          return cell;
        })
      );
      setBoard(newBoard);
      return;
    }

    // 2. Erase if clicking the same number already in cell
    if (currentCell.value === num) {
      handleErase();
      return;
    }

    // 3. Regular number placement
    const prevVal = currentCell.value;
    const prevNotes = [...currentCell.notes];

    // Check correctness
    const isSolutionMismatch = num !== currentCell.solution;
    if (instantErrorCheck && isSolutionMismatch) {
      soundManager.playQuizWrong();
      setMistakes(prev => prev + 1);
    } else {
      soundManager.playCardMatch();
    }

    setHistory(prev => [
      ...prev,
      {
        row: r,
        col: c,
        prevValue: prevVal,
        newValue: num,
        prevNotes,
        newNotes: []
      }
    ]);

    let newBoard = board.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if (rowIdx === r && colIdx === c) {
          return {
            ...cell,
            value: num,
            notes: [],
            isError: instantErrorCheck ? isSolutionMismatch : false
          };
        }
        return cell;
      })
    );

    // Also check for duplicate conflicts in row, column, 3x3 box
    if (highlightDuplicates) {
      const conflictValidated = validateBoardErrors(newBoard);
      newBoard = newBoard.map((row, rowIdx) =>
        row.map((cell, colIdx) => ({
          ...cell,
          isError: cell.isError || conflictValidated[rowIdx][colIdx].isError
        }))
      );
    }

    setBoard(newBoard);

    // Check if puzzle is fully solved
    if (isSudokuSolved(newBoard)) {
      handleGameWin();
    }
  };

  // Erase cell content
  const handleErase = () => {
    if (!selectedCell || isPaused || isCompleted) return;
    const [r, c] = selectedCell;
    const currentCell = board[r][c];
    if (currentCell.isGiven || (currentCell.value === 0 && currentCell.notes.length === 0)) return;

    soundManager.playEraseSound();

    setHistory(prev => [
      ...prev,
      {
        row: r,
        col: c,
        prevValue: currentCell.value,
        newValue: 0,
        prevNotes: [...currentCell.notes],
        newNotes: []
      }
    ]);

    let newBoard = board.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if (rowIdx === r && colIdx === c) {
          return { ...cell, value: 0, notes: [], isError: false };
        }
        return cell;
      })
    );

    if (highlightDuplicates) {
      newBoard = validateBoardErrors(newBoard);
    }
    setBoard(newBoard);
  };

  // Undo move
  const handleUndo = () => {
    if (history.length === 0 || isPaused || isCompleted) return;
    const lastMove = history[history.length - 1];
    setHistory(prev => prev.slice(0, prev.length - 1));

    soundManager.playCardSlap();

    let newBoard = board.map((row, r) =>
      row.map((cell, c) => {
        if (r === lastMove.row && c === lastMove.col) {
          return {
            ...cell,
            value: lastMove.prevValue,
            notes: lastMove.prevNotes,
            isError: false
          };
        }
        return cell;
      })
    );

    if (highlightDuplicates) {
      newBoard = validateBoardErrors(newBoard);
    }
    setBoard(newBoard);
    setSelectedCell([lastMove.row, lastMove.col]);
  };

  // Smart Hint: reveals solution for selected cell or next blank
  const handleHint = () => {
    if (isPaused || isCompleted) return;

    let targetR = selectedCell ? selectedCell[0] : 0;
    let targetC = selectedCell ? selectedCell[1] : 0;
    const currentCell = board[targetR]?.[targetC];

    // If current cell is already solved/given, find first empty or wrong cell
    if (!currentCell || currentCell.isGiven || currentCell.value === currentCell.solution) {
      let found = false;
      for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
          if (!board[r][c].isGiven && board[r][c].value !== board[r][c].solution) {
            targetR = r;
            targetC = c;
            found = true;
            break;
          }
        }
        if (found) break;
      }
      if (!found) return;
    }

    soundManager.playQuizCorrect();
    const correctVal = board[targetR][targetC].solution;
    setHintsUsed(prev => prev + 1);
    setSelectedCell([targetR, targetC]);

    let newBoard = board.map((row, rowIdx) =>
      row.map((cell, colIdx) => {
        if (rowIdx === targetR && colIdx === targetC) {
          return {
            ...cell,
            value: correctVal,
            notes: [],
            isError: false
          };
        }
        return cell;
      })
    );

    if (highlightDuplicates) {
      newBoard = validateBoardErrors(newBoard);
    }
    setBoard(newBoard);

    if (isSudokuSolved(newBoard)) {
      handleGameWin();
    }
  };

  // Puzzle victory celebration
  const handleGameWin = () => {
    setIsCompleted(true);
    soundManager.playVictorySound();
    confetti({
      particleCount: 90,
      spread: 75,
      origin: { y: 0.6 }
    });

    setBestTimes(prev => {
      const currentBest = prev[difficulty];
      const updatedBest = currentBest === null || timeElapsed < currentBest ? timeElapsed : currentBest;
      const next = { ...prev, [difficulty]: updatedBest };
      try {
        localStorage.setItem('sudoku_best_times_v2', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    soundManager.speak(`축하합니다! ${formatTime(timeElapsed)} 만에 스도쿠 퍼즐을 완성했습니다.`);
  };

  // Keyboard navigation & number input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPaused || isCompleted || !selectedCell) return;
      const [r, c] = selectedCell;

      if (e.key >= '1' && e.key <= '9') {
        handleInputNumber(Number(e.key));
      } else if (e.key === 'Backspace' || e.key === 'Delete') {
        handleErase();
      } else if (e.key === 'n' || e.key === 'N') {
        setIsNoteMode(prev => !prev);
      } else if (e.key === 'z' || e.key === 'Z') {
        if (e.ctrlKey || e.metaKey) {
          handleUndo();
        }
      } else if (e.key === 'h' || e.key === 'H') {
        handleHint();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedCell([Math.max(0, r - 1), c]);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedCell([Math.min(8, r + 1), c]);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        setSelectedCell([r, Math.max(0, c - 1)]);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        setSelectedCell([r, Math.min(8, c + 1)]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedCell, isPaused, isCompleted, isNoteMode, board, instantErrorCheck, highlightDuplicates]); // eslint-disable-line react-hooks/exhaustive-deps

  // Selected cell number
  const selectedNum = selectedCell && board[selectedCell[0]]?.[selectedCell[1]]
    ? board[selectedCell[0]][selectedCell[1]].value
    : 0;

  // Count remaining occurrences for each digit 1-9
  const digitCounts: Record<number, number> = {};
  for (let n = 1; n <= 9; n++) digitCounts[n] = 0;
  board.forEach(row => {
    row.forEach(cell => {
      if (cell.value >= 1 && cell.value <= 9 && !cell.isError) {
        digitCounts[cell.value] = (digitCounts[cell.value] || 0) + 1;
      }
    });
  });

  return (
    <div className={`w-full max-w-4xl mx-auto space-y-4 ${externalLargeFont ? 'text-lg' : ''}`}>
      {/* Top Header & Difficulty Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black text-lg shadow-sm">
            9×9
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900">
              스마트 브레인 스도쿠
            </h2>
            <p className="text-xs text-stone-500">
              정밀한 논리 연산과 공간 패턴 분석으로 40대 전두엽을 깨우는 퍼즐
            </p>
          </div>
        </div>

        {/* Difficulty Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
          {(['easy', 'medium', 'hard'] as Difficulty[]).map(diff => (
            <button
              key={diff}
              onClick={() => {
                if (diff !== difficulty) {
                  setDifficulty(diff);
                }
              }}
              className={`px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                difficulty === diff
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              {diff === 'easy' ? '쉬움' : diff === 'medium' ? '보통' : '어려움'}
            </button>
          ))}
        </div>
      </div>

      {/* Game HUD Bar: Timer, Mistakes, Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-900 text-white p-3 sm:p-4 rounded-2xl border border-stone-800 shadow-md">
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
          {/* Timer */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-base sm:text-lg font-bold tabular-nums">
              {formatTime(timeElapsed)}
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 hover:bg-stone-800 rounded text-stone-300 hover:text-white ml-1"
              title={isPaused ? '재개' : '일시정지'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>

          <div className="h-6 w-px bg-stone-700" />

          {/* Mistakes */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 text-xs">오답:</span>
            <span className={`font-mono font-bold ${mistakes > 0 ? 'text-rose-400' : 'text-stone-300'}`}>
              {mistakes}회
            </span>
          </div>

          {bestTimes[difficulty] !== null && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-amber-300">
              <Trophy className="w-3.5 h-3.5" />
              <span>최고: {formatTime(bestTimes[difficulty]!)}</span>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={handleUndo}
            disabled={history.length === 0 || isPaused || isCompleted}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 border border-stone-700 transition-colors"
            title="실행 취소 (Ctrl+Z)"
          >
            <Undo2 className="w-4 h-4" />
            <span className="hidden sm:inline">되돌리기</span>
          </button>

          <button
            onClick={handleErase}
            disabled={isPaused || isCompleted}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 disabled:opacity-40 text-xs font-semibold flex items-center gap-1 border border-stone-700 transition-colors"
            title="지우기 (Delete/Backspace)"
          >
            <Eraser className="w-4 h-4" />
            <span className="hidden sm:inline">지우기</span>
          </button>

          <button
            onClick={() => setIsNoteMode(!isNoteMode)}
            disabled={isPaused || isCompleted}
            className={`px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              isNoteMode
                ? 'bg-amber-500 border-amber-400 text-stone-950 shadow-md ring-2 ring-amber-400/50'
                : 'bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300'
            }`}
            title="후보 숫자 메모 (단축키 N)"
          >
            <Pencil className="w-4 h-4" />
            <span>메모 {isNoteMode ? 'ON' : 'OFF'}</span>
          </button>

          <button
            onClick={handleHint}
            disabled={isPaused || isCompleted}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold flex items-center gap-1 transition-colors"
            title="스마트 힌트 보기 (단축키 H)"
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">힌트</span>
          </button>

          <button
            onClick={() => setShowSolutionModal(true)}
            className="px-2.5 py-1.5 sm:px-3 sm:py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1 border border-stone-700 transition-colors"
            title="전체 정답 해답표 확인"
          >
            <Eye className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">정답표</span>
          </button>

          <button
            onClick={() => startNewGame(difficulty)}
            className="p-2 sm:px-3 sm:py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold flex items-center gap-1 border border-stone-700 transition-colors"
            title="새 퍼즐 시작"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">새 판</span>
          </button>
        </div>
      </div>

      {/* Main Sudoku Board & Keypad Container */}
      <div className="flex flex-col lg:flex-row items-center justify-center gap-5 sm:gap-7 p-4 sm:p-6 bg-stone-100 rounded-3xl border border-stone-300/80 relative">
        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-30 bg-stone-900/85 backdrop-blur-xs rounded-3xl flex flex-col items-center justify-center text-white space-y-4">
            <Pause className="w-12 h-12 text-emerald-400 animate-pulse" />
            <h3 className="text-2xl font-black">게임이 일시정지되었습니다</h3>
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
            >
              계속 플레이하기
            </button>
          </div>
        )}

        {/* 9x9 Sudoku Grid Board */}
        <div className="bg-stone-900 p-2 sm:p-3 rounded-2xl shadow-xl border-4 border-stone-900 select-none max-w-full overflow-hidden">
          <div className="grid grid-cols-9 bg-stone-300 gap-[1px] border-2 border-stone-900">
            {board.map((row, r) =>
              row.map((cell, c) => {
                const isSelected = selectedCell?.[0] === r && selectedCell?.[1] === c;
                const isRowOrCol = selectedCell && (selectedCell[0] === r || selectedCell[1] === c);
                const isBox = selectedCell && (
                  Math.floor(selectedCell[0] / 3) === Math.floor(r / 3) &&
                  Math.floor(selectedCell[1] / 3) === Math.floor(c / 3)
                );
                const isSameNum = selectedNum > 0 && cell.value === selectedNum;

                // Thicker borders for 3x3 subgrids
                const isRightBoxBorder = c % 3 === 2 && c !== 8;
                const isBottomBoxBorder = r % 3 === 2 && r !== 8;

                // Background highlight colors
                let cellBg = 'bg-white';
                if (cell.isError) {
                  cellBg = 'bg-rose-100';
                } else if (isSelected) {
                  cellBg = 'bg-emerald-300 ring-2 ring-emerald-600 z-10';
                } else if (isSameNum) {
                  cellBg = 'bg-emerald-100/90 font-bold';
                } else if (isRowOrCol || isBox) {
                  cellBg = 'bg-emerald-50/50';
                }

                return (
                  <button
                    key={`${r}-${c}`}
                    type="button"
                    onClick={() => handleCellClick(r, c)}
                    className={`
                      w-8 h-8 min-[380px]:w-9 min-[380px]:h-9 sm:w-12 sm:h-12 md:w-13 md:h-13
                      flex items-center justify-center text-center relative
                      transition-colors duration-75 font-mono
                      ${cellBg}
                      ${isRightBoxBorder ? 'border-r-2 sm:border-r-[3px] border-r-stone-900' : ''}
                      ${isBottomBoxBorder ? 'border-b-2 sm:border-b-[3px] border-b-stone-900' : ''}
                      ${cell.isGiven ? 'font-black text-stone-950' : 'font-extrabold text-emerald-800'}
                      ${cell.isError ? '!text-rose-600 font-black' : ''}
                      ${externalLargeFont ? 'text-lg sm:text-2xl' : 'text-base sm:text-xl'}
                    `}
                  >
                    {cell.value !== 0 ? (
                      <span className="leading-none">{cell.value}</span>
                    ) : cell.notes.length > 0 ? (
                      /* 3x3 Mini Candidate Notes Matrix */
                      <div className="grid grid-cols-3 w-full h-full p-0.5 pointer-events-none text-[8px] sm:text-[9px] text-stone-600 font-semibold leading-none items-center justify-center">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                          <span key={n} className="flex items-center justify-center">
                            {cell.notes.includes(n) ? n : ''}
                          </span>
                        ))}
                      </div>
                    ) : null}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Number Keypad 1-9 & Remaining Count HUD */}
        <div className="flex flex-col items-center justify-between space-y-4 w-full lg:w-56">
          <div className="flex items-center justify-between w-full px-1">
            <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
              숫자 입력 패드
            </span>
            <span className="text-[11px] text-stone-500">
              클릭하여 입력
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2.5 w-full max-w-xs">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => {
              const isFilled = digitCounts[num] >= 9;
              return (
                <button
                  key={num}
                  type="button"
                  onClick={() => handleInputNumber(num)}
                  disabled={isPaused || isCompleted}
                  className={`
                    py-3 sm:py-3.5 rounded-2xl border-2 font-mono font-black text-xl sm:text-2xl
                    flex flex-col items-center justify-center transition-all duration-100 select-none
                    ${
                      isFilled
                        ? 'bg-stone-200 border-stone-300 text-stone-400 opacity-60 cursor-default'
                        : 'bg-white hover:bg-emerald-50 border-stone-300 hover:border-emerald-500 text-stone-900 shadow-sm active:scale-95 cursor-pointer'
                    }
                  `}
                >
                  <span className="leading-tight">{num}</span>
                  <span className="text-[10px] font-sans font-medium text-stone-500 mt-0.5">
                    {isFilled ? <Check className="w-3 h-3 text-emerald-600 inline" /> : `${9 - digitCounts[num]}개 남음`}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Guidance Box */}
          <div className="p-3 bg-white rounded-xl border border-stone-200 text-stone-600 text-xs w-full space-y-1">
            <div className="flex items-center justify-between font-semibold text-stone-800">
              <span>단축키 안내:</span>
              <span className="font-mono text-emerald-700">1~9, N, Z, H</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              원하는 칸을 누른 뒤 숫자키를 누르거나, 패드를 터치하세요.
            </p>
          </div>
        </div>
      </div>

      {/* Completion Modal */}
      {isCompleted && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 text-stone-900 shadow-2xl border-4 border-emerald-500 text-center space-y-5 animate-in zoom-in-95">
            <div className="inline-flex p-4 bg-emerald-100 rounded-full text-emerald-600">
              <Trophy className="w-12 h-12" />
            </div>

            <div>
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-800">
                SUDOKU CLEAR!
              </h3>
              <p className="text-sm text-stone-600 mt-1">
                완벽한 논리 추론으로 9×9 스도쿠를 완성했습니다.
              </p>
            </div>

            <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200 space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="text-stone-600">난이도:</span>
                <span className="font-bold text-stone-900">
                  {difficulty === 'easy' ? '쉬움' : difficulty === 'medium' ? '보통' : '어려움'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">완성 시간:</span>
                <span className="font-mono font-bold text-emerald-700 text-base">
                  {formatTime(timeElapsed)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">오답 횟수:</span>
                <span className="font-bold text-stone-800">{mistakes}회</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600">사용 힌트:</span>
                <span className="font-bold text-stone-800">{hintsUsed}회</span>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 text-left flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>
                9×9 스도쿠는 가로, 세로, 3×3 구역의 숫자를 다각도로 검증하며 40대의 전두엽 연산 추론과 작업 기억(Working Memory)을 최대로 활성화합니다.
              </span>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => startNewGame(difficulty)}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
              >
                다음 퍼즐 도전하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Solution Key Modal */}
      {showSolutionModal && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-5 sm:p-7 text-stone-900 shadow-2xl border-2 border-stone-200 text-center space-y-4 animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-black text-stone-900 flex items-center gap-2">
                  <CheckCheck className="w-5 h-5 text-emerald-600" />
                  <span>스도쿠 정답표 (Solution Key)</span>
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  가로·세로·3×3 구역에 1~9가 중복 없이 완벽히 배치된 유일 정답입니다.
                </p>
              </div>
              <button
                onClick={() => setShowSolutionModal(false)}
                className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-400 hover:text-stone-700 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {/* 9x9 Solution Mini Board */}
            <div className="bg-stone-900 p-2 rounded-xl shadow-inner mx-auto inline-block border-2 border-stone-900 select-none">
              <div className="grid grid-cols-9 bg-stone-300 gap-[1px]">
                {board.map((row, r) =>
                  row.map((cell, c) => {
                    const isRightBorder = c % 3 === 2 && c !== 8;
                    const isBottomBorder = r % 3 === 2 && r !== 8;

                    return (
                      <div
                        key={`sol-${r}-${c}`}
                        className={`
                          w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center font-mono text-sm sm:text-base font-bold
                          ${cell.isGiven ? 'bg-white text-stone-950 font-black' : 'bg-emerald-50 text-emerald-700 font-extrabold'}
                          ${isRightBorder ? 'border-r-2 border-r-stone-900' : ''}
                          ${isBottomBorder ? 'border-b-2 border-b-stone-900' : ''}
                        `}
                      >
                        {cell.solution}
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs text-stone-600">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-white border border-stone-400 rounded-xs font-bold text-stone-950 inline-block text-[9px] leading-3 text-center">1</span>
                <span>문제 힌트</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 bg-emerald-100 border border-emerald-400 rounded-xs font-bold text-emerald-800 inline-block text-[9px] leading-3 text-center">9</span>
                <span>정답 해답</span>
              </span>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowSolutionModal(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                닫기
              </button>
              <button
                type="button"
                onClick={handleAutoSolve}
                className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                <span>이 답으로 자동 채우기</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
