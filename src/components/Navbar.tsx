import React from 'react';
import { Volume2, VolumeX, Type } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type ActiveTab = 'sudoku' | 'memory' | 'quiz' | 'checkup';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLargeFont: boolean;
  setIsLargeFont: (large: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLargeFont,
  setIsLargeFont,
  soundEnabled,
  setSoundEnabled
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
    soundManager.setTtsEnabled(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('sudoku')}
          className="text-lg sm:text-xl font-extrabold tracking-tight text-emerald-800 hover:text-emerald-900 transition-colors whitespace-nowrap"
        >
          브레인핏 40
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-6 text-xs sm:text-sm font-semibold text-stone-600">
          <button
            onClick={() => setActiveTab('sudoku')}
            className={`py-1 hover:text-stone-900 transition-colors whitespace-nowrap ${
              activeTab === 'sudoku'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-bold'
                : 'text-stone-600'
            }`}
          >
            스마트 스도쿠
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`py-1 hover:text-stone-900 transition-colors whitespace-nowrap ${
              activeTab === 'memory'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-bold'
                : 'text-stone-600'
            }`}
          >
            모던 메모리
          </button>

          <button
            onClick={() => setActiveTab('quiz')}
            className={`py-1 hover:text-stone-900 transition-colors whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-bold'
                : 'text-stone-600'
            }`}
          >
            두뇌 인지퀴즈
          </button>

          <button
            onClick={() => setActiveTab('checkup')}
            className={`py-1 hover:text-stone-900 transition-colors whitespace-nowrap ${
              activeTab === 'checkup'
                ? 'text-emerald-700 border-b-2 border-emerald-600 font-bold'
                : 'text-stone-600'
            }`}
          >
            인지·집중력 체크
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsLargeFont(!isLargeFont)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1.5 border shadow-xs ${
              isLargeFont
                ? 'bg-amber-400 text-stone-950 border-amber-500 ring-2 ring-amber-300'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-300'
            }`}
            title="시니어 전용 큰 글씨 모드 전환"
          >
            <Type className="w-4 h-4" />
            <span>{isLargeFont ? '보통 글씨' : '큰 글씨'}</span>
          </button>

          <button
            onClick={toggleSound}
            className={`p-2 text-xs font-medium rounded-xl transition-colors border ${
              soundEnabled
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                : 'bg-stone-100 text-stone-400 border-stone-300'
            }`}
            title="효과음 및 음성 안내 토글"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
};
