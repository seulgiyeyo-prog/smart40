import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { MEMORY_CARD_ITEMS } from '../data/cognitiveQuizzes';
import { MemoryPairCard } from '../types/quiz';
import { soundManager } from '../utils/audio';
import { updateTodayPerformance } from '../utils/brainTrendData';
import {
  RotateCcw,
  Trophy,
  Zap,
  Sparkles,
  Check,
  Clock,
  Play,
  Pause
} from 'lucide-react';

export type MemoryDifficulty = 'easy' | 'medium' | 'hard';

const DIFFICULTY_CONFIG: Record<MemoryDifficulty, {
  label: string;
  pairs: number;
  totalCards: number;
  gridColsClass: string;
  cardSizeClass: string;
  description: string;
}> = {
  easy: {
    label: '쉬움',
    pairs: 6,
    totalCards: 12,
    gridColsClass: 'grid-cols-3 sm:grid-cols-4 max-w-lg',
    cardSizeClass: 'p-3 sm:p-4 text-3xl sm:text-4xl',
    description: '12장 (6쌍) · 가벼운 집중 워밍업'
  },
  medium: {
    label: '보통',
    pairs: 8,
    totalCards: 16,
    gridColsClass: 'grid-cols-4 max-w-xl',
    cardSizeClass: 'p-2.5 sm:p-3 text-3xl sm:text-4xl',
    description: '16장 (8쌍) · 표준 해마 작업 기억 훈련'
  },
  hard: {
    label: '어려움',
    pairs: 12,
    totalCards: 24,
    gridColsClass: 'grid-cols-4 sm:grid-cols-6 max-w-2xl',
    cardSizeClass: 'p-2 sm:p-2.5 text-2xl sm:text-3xl',
    description: '24장 (12쌍) · 고난도 멀티태스킹 기억력'
  }
};

export const MemoryCardMatch: React.FC = () => {
  const [difficulty, setDifficulty] = useState<MemoryDifficulty>('medium');
  const [cards, setCards] = useState<MemoryPairCard[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedCount, setMatchedCount] = useState<number>(0);
  const [isWon, setIsWon] = useState<boolean>(false);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Best times recorded per difficulty
  const [bestTimes, setBestTimes] = useState<Record<MemoryDifficulty, number | null>>(() => {
    try {
      const saved = localStorage.getItem('memory_card_best_times_v2');
      if (saved) return JSON.parse(saved);
    } catch {
      // fallback
    }
    return { easy: null, medium: null, hard: null };
  });

  const config = DIFFICULTY_CONFIG[difficulty];

  // Initialize deck based on difficulty
  const initGame = useCallback((diff: MemoryDifficulty = difficulty) => {
    soundManager.playCardSlap();
    const currentConfig = DIFFICULTY_CONFIG[diff];
    const pairCount = currentConfig.pairs;

    // Pick first N items from MEMORY_CARD_ITEMS
    const selectedItems = MEMORY_CARD_ITEMS.slice(0, pairCount);
    const deckItems = [...selectedItems, ...selectedItems];

    // Shuffle cards
    const shuffled = deckItems
      .map((item, index) => ({
        id: `mem-${diff}-${index}-${Math.random()}`,
        pairId: selectedItems.findIndex(m => m.name === item.name),
        name: item.name,
        emoji: item.emoji,
        isFlipped: false,
        isMatched: false
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
    setMatchedCount(0);
    setIsWon(false);
    setTimeElapsed(0);
    setIsPaused(false);

    soundManager.speak(`${currentConfig.label} 난이도 메모리 카드가 준비되었습니다.`);
  }, [difficulty]);

  useEffect(() => {
    initGame(difficulty);
  }, [difficulty]); // eslint-disable-line react-hooks/exhaustive-deps

  // Timer loop
  useEffect(() => {
    if (isPaused || isWon || cards.length === 0) return;
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused, isWon, cards.length]);

  const handleCardClick = (index: number) => {
    if (
      isPaused ||
      isWon ||
      cards[index].isFlipped ||
      cards[index].isMatched ||
      flippedIndices.length === 2
    ) {
      return;
    }

    soundManager.playCardSlap();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(prev => prev + 1);
      const [firstIdx, secondIdx] = newFlipped;

      if (cards[firstIdx].pairId === cards[secondIdx].pairId) {
        // Matched!
        setTimeout(() => {
          soundManager.playCardMatch();
          newCards[firstIdx].isMatched = true;
          newCards[secondIdx].isMatched = true;
          setCards([...newCards]);
          setFlippedIndices([]);
          setMatchedCount(prev => {
            const next = prev + 1;
            if (next === config.pairs) {
              handleGameVictory();
            }
            return next;
          });
        }, 300);
      } else {
        // Not matched, flip back
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards([...newCards]);
          setFlippedIndices([]);
        }, 800);
      }
    }
  };

  const handleGameVictory = () => {
    setIsWon(true);
    soundManager.playVictorySound();
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });

    // Update brain trend performance
    const calculatedScore = Math.max(65, Math.min(100, Math.round(100 - (moves - config.pairs) * 2.5)));
    updateTodayPerformance({ memoryScore: calculatedScore });

    // Save best time
    setBestTimes(prev => {
      const currentBest = prev[difficulty];
      const updatedBest = currentBest === null || timeElapsed < currentBest ? timeElapsed : currentBest;
      const next = { ...prev, [difficulty]: updatedBest };
      try {
        localStorage.setItem('memory_card_best_times_v2', JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });

    soundManager.speak(`축하합니다! ${formatTimer(timeElapsed)} 만에 모든 짝을 맞추셨습니다.`);
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-5">
      {/* Top Header & Difficulty Selector */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900">
              모던 포커스 메모리
            </h2>
            <p className="text-xs text-stone-500">
              {config.description}
            </p>
          </div>
        </div>

        {/* Difficulty Tabs: 쉬움 (12장), 보통 (16장), 어려움 (24장) */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200">
          {(['easy', 'medium', 'hard'] as MemoryDifficulty[]).map(diff => (
            <button
              key={diff}
              onClick={() => {
                if (diff !== difficulty) {
                  setDifficulty(diff);
                }
              }}
              className={`px-3 sm:px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                difficulty === diff
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-950'
              }`}
            >
              {DIFFICULTY_CONFIG[diff].label} ({DIFFICULTY_CONFIG[diff].totalCards}장)
            </button>
          ))}
        </div>
      </div>

      {/* Modern HUD: Time, Turns, Matches, Best Time */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900 text-white p-3.5 sm:p-4 rounded-2xl border border-slate-800 shadow-md">
        <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-sm">
          {/* Timer */}
          <div className="flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-emerald-400" />
            <span className="font-mono text-base sm:text-lg font-bold tabular-nums">
              {formatTimer(timeElapsed)}
            </span>
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="p-1 hover:bg-slate-800 rounded text-slate-300 hover:text-white ml-1"
              title={isPaused ? '재개' : '일시정지'}
            >
              {isPaused ? <Play className="w-4 h-4 text-emerald-400" /> : <Pause className="w-4 h-4" />}
            </button>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          {/* Moves */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-xs">시도:</span>
            <span className="font-mono font-bold text-white text-base">
              {moves}회
            </span>
          </div>

          <div className="h-6 w-px bg-slate-800" />

          {/* Matches */}
          <div className="flex items-center gap-1.5">
            <span className="text-slate-400 text-xs">매칭:</span>
            <span className="font-mono font-bold text-emerald-400 text-base">
              {matchedCount} / {config.pairs}
            </span>
          </div>

          {bestTimes[difficulty] !== null && (
            <div className="hidden sm:flex items-center gap-1 text-xs text-amber-300">
              <Trophy className="w-3.5 h-3.5" />
              <span>최고: {formatTimer(bestTimes[difficulty]!)}</span>
            </div>
          )}
        </div>

        <button
          onClick={() => initGame(difficulty)}
          className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-slate-700 transition-colors shadow-sm"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>다시 섞기</span>
        </button>
      </div>

      {/* Modern Grid of Cards (Responsive by Difficulty) */}
      <div className="bg-slate-950 p-4 sm:p-7 rounded-3xl border border-slate-800/80 shadow-2xl relative overflow-hidden">
        {/* Subtle geometric ambient grid */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: 'linear-gradient(to right, #334155 1px, transparent 1px), linear-gradient(to bottom, #334155 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        {/* Pause Overlay */}
        {isPaused && (
          <div className="absolute inset-0 z-30 bg-slate-950/85 backdrop-blur-xs flex flex-col items-center justify-center text-white space-y-4">
            <Pause className="w-12 h-12 text-emerald-400 animate-pulse" />
            <h3 className="text-2xl font-black">게임이 일시정지되었습니다</h3>
            <button
              onClick={() => setIsPaused(false)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-95"
            >
              계속하기
            </button>
          </div>
        )}

        <div className={`grid ${config.gridColsClass} gap-2.5 sm:gap-4 mx-auto relative z-10 justify-items-center`}>
          {cards.map((card, idx) => {
            const isOpen = card.isFlipped || card.isMatched;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => handleCardClick(idx)}
                disabled={card.isMatched || card.isFlipped || flippedIndices.length === 2 || isPaused}
                className={`
                  w-full aspect-square rounded-2xl ${config.cardSizeClass} flex flex-col items-center justify-between
                  transition-all duration-150 border-2 select-none relative overflow-hidden group
                  ${
                    isOpen
                      ? card.isMatched
                        ? 'bg-slate-900 border-emerald-500/70 shadow-emerald-950/40 shadow-inner'
                        : 'bg-slate-800 border-amber-400/90 shadow-xl scale-102 ring-2 ring-amber-400/30'
                      : 'bg-gradient-to-b from-slate-900 to-slate-950 hover:from-slate-800 hover:to-slate-900 border-slate-800 hover:border-emerald-500/50 shadow-md cursor-pointer active:scale-96'
                  }
                `}
              >
                {isOpen ? (
                  // Front Face (Modern & Clean)
                  <div className="w-full h-full flex flex-col items-center justify-center animate-in zoom-in-90 duration-150">
                    <span className="filter drop-shadow-md transition-transform group-hover:scale-110 leading-none">
                      {card.emoji}
                    </span>
                    <span className="text-[10px] sm:text-xs font-semibold text-slate-200 mt-1 sm:mt-1.5 tracking-tight line-clamp-1">
                      {card.name}
                    </span>
                    {card.isMatched && (
                      <div className="absolute top-1.5 right-1.5 text-emerald-400">
                        <Check className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                ) : (
                  // Back Face (Sleek Minimalist Tech Aesthetic)
                  <div className="w-full h-full flex flex-col items-center justify-center space-y-1">
                    <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400/80 group-hover:text-emerald-300 group-hover:border-emerald-500/40 transition-colors">
                      <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </div>
                    <span className="text-[8px] sm:text-[9px] font-mono tracking-widest text-slate-500 uppercase font-semibold group-hover:text-slate-400">
                      FOCUS
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modern Victory Celebration Card */}
      {isWon && (
        <div className="p-6 sm:p-8 bg-slate-900 border border-emerald-500/50 rounded-3xl text-center space-y-4 shadow-2xl text-white animate-in fade-in zoom-in-95">
          <div className="inline-flex p-3.5 bg-emerald-500/20 border border-emerald-400/40 rounded-2xl text-emerald-400">
            <Trophy className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
              PERFECT FOCUS!
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto break-keep sm:whitespace-nowrap">
              {config.label} 난이도({config.totalCards}장)를 총 <span className="text-emerald-400 font-bold font-mono">{moves}회</span> 만에, 소요 시간 <span className="text-amber-300 font-bold font-mono">{formatTimer(timeElapsed)}</span>으로 모두 매칭했습니다!
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={() => initGame(difficulty)}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer"
            >
              새 라운드 시작
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
