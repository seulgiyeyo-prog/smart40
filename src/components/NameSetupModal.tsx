import React, { useState } from 'react';
import { Sparkles, User, Check, X, Brain } from 'lucide-react';
import { soundManager } from '../utils/audio';

interface NameSetupModalProps {
  isOpen: boolean;
  currentName: string;
  onSave: (name: string) => void;
  onClose?: () => void;
  isInitial?: boolean;
}

export const NameSetupModal: React.FC<NameSetupModalProps> = ({
  isOpen,
  currentName,
  onSave,
  onClose,
  isInitial = false
}) => {
  const [inputName, setInputName] = useState(currentName);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputName.trim();
    if (!trimmed) return;
    onSave(trimmed);
    soundManager.playVictorySound();
    soundManager.speak(`${trimmed}님 환영합니다! 오늘 두뇌 트레이닝을 시작합니다.`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header with Warm Aesthetic */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white text-center relative">
          {!isInitial && onClose && (
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 text-emerald-200 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}

          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center text-yellow-300 shadow-inner">
            <Brain className="w-7 h-7" />
          </div>

          <h3 className="text-xl sm:text-2xl font-black tracking-tight">
            {isInitial ? '환영합니다! 두뇌 트레이너 등록' : '트레이너 이름 변경'}
          </h3>
          <p className="text-xs sm:text-sm text-emerald-100 mt-1">
            이름을 등록하시면 매일 나만의 두뇌 피트니스 기록이 차곡차곡 쌓입니다.
          </p>
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              트레이너 이름 또는 닉네임
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                autoFocus
                maxLength={12}
                value={inputName}
                onChange={e => setInputName(e.target.value)}
                placeholder="이름 또는 닉네임을 입력하세요"
                className="w-full pl-10 pr-4 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold placeholder:text-stone-400 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              />
            </div>
            <p className="text-[11px] text-stone-500">
              * 최대 12자까지 입력하실 수 있으며 언제든지 수정할 수 있습니다.
            </p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={!inputName.trim()}
              className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-600 disabled:opacity-50 disabled:pointer-events-none text-white font-bold text-sm rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>{isInitial ? '나의 두뇌 트레이닝 시작하기' : '저장 완료'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
