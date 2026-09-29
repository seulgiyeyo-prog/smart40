import React from 'react';
import { Volume2, VolumeX, Type, User, UserCheck } from 'lucide-react';
import { soundManager } from '../utils/audio';

export type ActiveTab = 'sudoku' | 'memory' | 'quiz' | 'checkup';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isLargeFont: boolean;
  setIsLargeFont: (large: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  userName?: string;
  onOpenNameModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  isLargeFont,
  setIsLargeFont,
  soundEnabled,
  setSoundEnabled,
  userName,
  onOpenNameModal
}) => {
  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    soundManager.setSoundEnabled(next);
    soundManager.setTtsEnabled(next);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('sudoku')}
          className="text-lg sm:text-xl font-extrabold tracking-tight text-emerald-800 hover:text-emerald-900 transition-colors whitespace-nowrap shrink-0"
        >
          브레인핏 40
        </button>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="flex items-center gap-1 sm:gap-6 text-xs sm:text-sm font-semibold text-stone-600 overflow-x-auto py-1">
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

        {/* Zone 3: Profile & Control actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* User Name Badge */}
          {onOpenNameModal && (
            <button
              onClick={onOpenNameModal}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 shadow-2xs cursor-pointer"
              title="트레이너 이름 변경"
            >
              {userName ? (
                <>
                  <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-extrabold max-w-[80px] sm:max-w-[120px] truncate">{userName}</span>
                  <span className="text-[10px] text-emerald-600 font-normal hidden sm:inline">님</span>
                </>
              ) : (
                <>
                  <User className="w-3.5 h-3.5 text-emerald-600" />
                  <span>이름 등록</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={() => setIsLargeFont(!isLargeFont)}
            className={`px-2.5 sm:px-3 py-1.5 text-xs font-bold rounded-xl transition-all whitespace-nowrap flex items-center gap-1 border shadow-2xs ${
              isLargeFont
                ? 'bg-amber-400 text-stone-950 border-amber-500 ring-2 ring-amber-300'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200 border-stone-300'
            }`}
            title="시니어 전용 큰 글씨 모드 전환"
          >
            <Type className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isLargeFont ? '보통 글씨' : '큰 글씨'}</span>
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

