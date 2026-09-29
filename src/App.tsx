import React, { useState, useEffect } from 'react';
import { Navbar, ActiveTab } from './components/Navbar';
import { SudokuGame } from './components/SudokuGame';
import { CognitiveQuizView } from './components/CognitiveQuizView';
import { MemoryCardMatch } from './components/MemoryCardMatch';
import { BrainCheckup } from './components/BrainCheckup';
import { soundManager } from './utils/audio';
import { updateTodayPerformance } from './utils/brainTrendData';
import { Sparkles, Brain, Award, Heart, CheckCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('sudoku');
  const [isLargeFont, setIsLargeFont] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Daily cognitive stats in localStorage
  const [dailyStats, setDailyStats] = useState<{
    sudokuCompleted: number;
    quizzesSolved: number;
    date: string;
  }>(() => {
    const today = new Date().toISOString().split('T')[0];
    try {
      const saved = localStorage.getItem('brainfit40_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.date === today) return parsed;
      }
    } catch {
      // fallback
    }
    return { sudokuCompleted: 0, quizzesSolved: 0, date: today };
  });

  useEffect(() => {
    try {
      localStorage.setItem('brainfit40_stats', JSON.stringify(dailyStats));
    } catch {
      // ignore
    }
  }, [dailyStats]);

  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
    soundManager.playCardSlap();
  };

  const handleQuizDone = (score: number, total: number) => {
    setDailyStats(prev => ({
      ...prev,
      quizzesSolved: prev.quizzesSolved + total
    }));
    if (total > 0) {
      const accuracy = Math.round((score / total) * 100);
      updateTodayPerformance({ quizAccuracy: accuracy });
    }
  };

  return (
    <div className={`min-h-screen flex flex-col bg-stone-100/70 text-stone-900 ${isLargeFont ? 'text-lg' : 'text-base'}`}>
      {/* Top Navbar Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleTabChange}
        isLargeFont={isLargeFont}
        setIsLargeFont={setIsLargeFont}
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6">
        {/* Warm Greeting & Brain Health Daily Mission Banner */}
        <section className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-5 sm:p-7 text-white shadow-md flex flex-col md:flex-row items-center justify-between gap-6 border border-emerald-700/50">
          <div className="space-y-2 text-center md:text-left">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs font-semibold text-emerald-200">
              <span className="flex items-center gap-1 bg-emerald-700/60 px-2.5 py-1 rounded-full border border-emerald-500/40">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                <span>40대 스마트 브레인 루틴</span>
              </span>
              <span>·</span>
              <span>전두엽 논리 추론 & 작업 기억 피트니스</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white leading-tight">
              매일 10분 즐거운 두뇌 트레이닝, 스마트한 뇌 활력을 깨워요
            </h1>

            <p className="text-sm sm:text-base text-emerald-100 max-w-2xl leading-relaxed">
              스마트 스도쿠의 정밀한 논리 연산과 모던 포커스 메모리 게임, 인지 퀴즈로 40대 뇌 피로를 해소하고 집중력을 최상으로 유지하세요.
            </p>
          </div>

          {/* Quick Daily Mission Progress Card */}
          <div className="bg-black/25 rounded-xl p-4 border border-white/20 backdrop-blur-xs min-w-[240px] text-center space-y-2.5 shrink-0">
            <span className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1">
              <Award className="w-4 h-4" />
              <span>오늘 나의 두뇌 활력 활동</span>
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-white/10 p-2 rounded-lg">
                <span className="text-stone-300 block">스도쿠 트레이닝</span>
                <span className="text-lg font-black text-yellow-300">
                  {activeTab === 'sudoku' ? '진행 중' : '대기'}
                </span>
              </div>
              <div className="bg-white/10 p-2 rounded-lg">
                <span className="text-stone-300 block">푼 퀴즈 수</span>
                <span className="text-lg font-black text-emerald-300">
                  {dailyStats.quizzesSolved}개
                </span>
              </div>
            </div>
            <div className="text-[11px] text-emerald-200 flex items-center justify-center gap-1 pt-1">
              <Heart className="w-3.5 h-3.5 text-rose-300" />
              <span>오늘도 뇌 신경망이 활발하게 단련되고 있습니다!</span>
            </div>
          </div>
        </section>

        {/* Tab Routing Container */}
        <section className="transition-opacity duration-200">
          {activeTab === 'sudoku' && <SudokuGame externalLargeFont={isLargeFont} />}
          {activeTab === 'memory' && <MemoryCardMatch />}
          {activeTab === 'quiz' && <CognitiveQuizView onQuizComplete={handleQuizDone} />}
          {activeTab === 'checkup' && <BrainCheckup />}
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-200 bg-white py-6 text-stone-500 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div>
              <p className="font-semibold text-stone-700">
                브레인핏 40 · 40대 현대인을 위한 스마트 두뇌 트레이닝
              </p>
              <p className="text-[11px] text-stone-500 mt-0.5">
                인지과학 및 신경가소성 원리를 기반으로 일상 속 두뇌 피로 회복과 전두엽 집중력 강화를 지원합니다.
              </p>
            </div>
            <div className="text-[11px] text-stone-500 flex items-center gap-3">
              <span>뇌 피트니스 루틴: 매일 10분 스도쿠 논리 퍼즐 & 포커스 메모리</span>
            </div>
          </div>

          {/* Centered Developer & Designer Credit in English */}
          <div className="pt-3 border-t border-stone-100 flex flex-col items-center justify-center text-center">
            <p className="text-xs sm:text-sm font-medium text-stone-600 tracking-tight">
              Developed & Designed by <span className="font-bold text-stone-900">Seulgi Jeong</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
