import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { COGNITIVE_QUIZZES } from '../data/cognitiveQuizzes';
import { QuizQuestion, QuizCategory } from '../types/quiz';
import { soundManager } from '../utils/audio';
import {
  Volume2,
  Sparkles,
  Lightbulb,
  CheckCircle,
  XCircle,
  RotateCcw,
  ArrowRight,
  Brain,
  Award,
  BookOpen,
  VolumeX
} from 'lucide-react';

interface CognitiveQuizViewProps {
  onQuizComplete?: (score: number, total: number) => void;
}

export const CognitiveQuizView: React.FC<CognitiveQuizViewProps> = ({ onQuizComplete }) => {
  const [selectedCategory, setSelectedCategory] = useState<QuizCategory | 'all'>('all');
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [isReadingTts, setIsReadingTts] = useState<boolean>(false);

  // Filter quizzes by category
  const filteredQuizzes: QuizQuestion[] = selectedCategory === 'all'
    ? COGNITIVE_QUIZZES
    : COGNITIVE_QUIZZES.filter(q => q.category === selectedCategory);

  const currentQuiz: QuizQuestion = filteredQuizzes[currentIndex] || COGNITIVE_QUIZZES[0];

  // Read current question with TTS voice
  const handleReadAloud = () => {
    if (isReadingTts) {
      soundManager.stopSpeaking();
      setIsReadingTts(false);
      return;
    }

    setIsReadingTts(true);
    const speechText = `${currentQuiz.categoryName} 문제입니다. ${currentQuiz.storyContext || ''} ${currentQuiz.ttsQuestionText || currentQuiz.question}. 보기 일 번, ${currentQuiz.options[0]}. 보기 이 번, ${currentQuiz.options[1]}. 보기 삼 번, ${currentQuiz.options[2]}. 보기 사 번, ${currentQuiz.options[3]}. 알맞은 정답을 눌러주세요.`;
    soundManager.speak(speechText, true);

    setTimeout(() => {
      setIsReadingTts(false);
    }, 12000);
  };

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    soundManager.stopSpeaking();

    const isCorrect = index === currentQuiz.correctIndex;
    if (isCorrect) {
      soundManager.playQuizCorrect();
      setCorrectCount(prev => prev + 1);
      soundManager.speak('정답입니다! 뇌가 활짝 깨어났습니다.');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      soundManager.playQuizWrong();
      soundManager.speak(`아쉽습니다. 정답은 ${currentQuiz.correctIndex + 1}번 ${currentQuiz.options[currentQuiz.correctIndex]}입니다.`);
    }
  };

  const handleNext = () => {
    soundManager.stopSpeaking();
    if (currentIndex < filteredQuizzes.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
      setShowHint(false);
    } else {
      setQuizFinished(true);
      if (onQuizComplete) {
        onQuizComplete(correctCount + (selectedOption === currentQuiz.correctIndex ? 0 : 0), filteredQuizzes.length);
      }
      soundManager.playVictorySound();
      soundManager.speak(`모든 두뇌 퀴즈를 완료하셨습니다! 총 ${filteredQuizzes.length}문제 중 ${correctCount + (selectedOption === currentQuiz.correctIndex ? 1 : 0)}문제를 맞추셨습니다!`);
    }
  };

  const handleRestart = () => {
    soundManager.stopSpeaking();
    setCurrentIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setCorrectCount(0);
    setQuizFinished(false);
  };

  const categories: { id: QuizCategory | 'all'; label: string }[] = [
    { id: 'all', label: '전체 문제' },
    { id: 'math', label: '계산력 훈련' },
    { id: 'language', label: '언어·속담' },
    { id: 'memory', label: '기억력 & 지남력' },
    { id: 'spatial', label: '시공간 인지' },
    { id: 'health', label: '두뇌 건강 상식' }
  ];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Category Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-stone-200/80 rounded-xl">
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setCurrentIndex(0);
              setSelectedOption(null);
              setIsAnswered(false);
              setShowHint(false);
              setQuizFinished(false);
            }}
            className={`px-3 py-2 text-xs sm:text-sm font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedCategory === cat.id
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-stone-700 hover:text-stone-950'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {!quizFinished ? (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 sm:p-8 space-y-6">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-200">
                {currentQuiz.categoryName}
              </span>
              <span className="text-stone-300">·</span>
              <span className="text-xs font-medium text-stone-500">
                문제 {currentIndex + 1} / {filteredQuizzes.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleReadAloud}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors border ${
                  isReadingTts
                    ? 'bg-amber-100 border-amber-300 text-amber-900 animate-pulse'
                    : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700'
                }`}
                title="문제와 보기를 또박또박 한국어로 읽어줍니다"
              >
                {isReadingTts ? <VolumeX className="w-4 h-4 text-amber-700" /> : <Volume2 className="w-4 h-4 text-emerald-700" />}
                <span>{isReadingTts ? '낭독 중지' : '소리로 듣기'}</span>
              </button>

              {currentQuiz.hint && !isAnswered && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-800 flex items-center gap-1"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>힌트</span>
                </button>
              )}
            </div>
          </div>

          {/* Story Context (Storytelling for seniors) */}
          {currentQuiz.storyContext && (
            <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100 text-stone-700 text-sm sm:text-base leading-relaxed flex items-start gap-2.5">
              <BookOpen className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <p>{currentQuiz.storyContext}</p>
            </div>
          )}

          {/* Question Text */}
          <div className="space-y-2">
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug tracking-tight">
              {currentQuiz.question}
            </h3>
          </div>

          {/* Hint disclosure */}
          {showHint && currentQuiz.hint && (
            <div className="p-3 bg-yellow-50 rounded-xl border border-yellow-200 text-xs sm:text-sm text-yellow-900 flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600 shrink-0" />
              <span>힌트: {currentQuiz.hint}</span>
            </div>
          )}

          {/* Answer Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            {currentQuiz.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = idx === currentQuiz.correctIndex;

              let btnStyle = 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-900 hover:border-emerald-300';

              if (isAnswered) {
                if (isCorrectAnswer) {
                  btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400';
                } else if (isSelected) {
                  btnStyle = 'bg-rose-50 border-rose-400 text-rose-950 ring-2 ring-rose-300';
                } else {
                  btnStyle = 'bg-stone-50 border-stone-200 text-stone-400 opacity-60';
                }
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  disabled={isAnswered}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all duration-150
                    flex items-center justify-between min-h-[64px]
                    ${btnStyle}
                    ${!isAnswered ? 'active:scale-98 cursor-pointer' : 'cursor-default'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white border border-stone-300 flex items-center justify-center font-bold text-xs shrink-0 text-stone-700">
                      {idx + 1}
                    </span>
                    <span className="text-base sm:text-lg font-medium">
                      {option}
                    </span>
                  </div>

                  {isAnswered && (
                    <div>
                      {isCorrectAnswer && <CheckCircle className="w-6 h-6 text-emerald-600" />}
                      {isSelected && !isCorrectAnswer && <XCircle className="w-6 h-6 text-rose-500" />}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation & Brain Health Tip Box */}
          {isAnswered && (
            <div className="p-4 sm:p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-3 animate-in fade-in">
              <div className="flex items-center gap-2">
                {selectedOption === currentQuiz.correctIndex ? (
                  <span className="text-base font-bold text-emerald-700 flex items-center gap-1">
                    <CheckCircle className="w-5 h-5 text-emerald-600" />
                    참 잘하셨습니다! 정답입니다!
                  </span>
                ) : (
                  <span className="text-base font-bold text-rose-700 flex items-center gap-1">
                    <XCircle className="w-5 h-5 text-rose-500" />
                    아쉽네요! 정답을 다시 한번 확인해보세요.
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-stone-700 leading-relaxed">
                {currentQuiz.explanation}
              </p>

              <div className="pt-2 border-t border-stone-200 text-xs sm:text-sm text-emerald-900 bg-emerald-50/70 p-3 rounded-lg flex items-start gap-2">
                <Brain className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">치매 예방 두뇌 꿀팁: </span>
                  <span>{currentQuiz.brainTip}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
                >
                  <span>{currentIndex < filteredQuizzes.length - 1 ? '다음 문제 풀기' : '결과 확인하기'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Quiz Finished Summary */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-8 text-center space-y-6 animate-in zoom-in-95">
          <div className="inline-flex p-4 bg-emerald-100 rounded-full text-emerald-600">
            <Award className="w-14 h-14" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-stone-900">
              두뇌 퀴즈 훈련 완료!
            </h3>
            <p className="text-stone-600 text-base">
              오늘의 인지 훈련 문제를 모두 훌륭하게 마치셨습니다.
            </p>
          </div>

          <div className="max-w-md mx-auto p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-600">총 푼 문제 수:</span>
              <span className="font-bold">{filteredQuizzes.length}문제</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-stone-600">정답 맞춘 수:</span>
              <span className="font-bold text-emerald-600">{correctCount}문제</span>
            </div>
            <div className="border-t pt-2 flex justify-between items-center text-base font-bold">
              <span>두뇌 활력도:</span>
              <span className="text-emerald-700 text-xl font-black">
                {Math.round((correctCount / filteredQuizzes.length) * 100)}점
              </span>
            </div>
          </div>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950 text-sm max-w-lg mx-auto">
            매일 5분씩 인지 퀴즈를 풀고 고스톱 패를 맞추면 뇌 혈류량이 증가하여 40대 전두엽 집중력과 업무 몰입도를 극대화하는 데 큰 도움이 됩니다!
          </div>

          <div className="flex justify-center gap-3">
            <button
              onClick={handleRestart}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-md flex items-center gap-2 transition-transform active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
              <span>처음부터 다시 풀기</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
