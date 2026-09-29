import React, { useState } from 'react';
import { DEMENTIA_SELF_CHECKLIST } from '../data/cognitiveQuizzes';
import { soundManager } from '../utils/audio';
import {
  CheckCircle,
  AlertCircle,
  HelpCircle,
  Heart,
  Activity,
  Smile,
  Sun,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';

export const BrainCheckup: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'checkup' | 'gym' | 'tips'>('checkup');

  const handleSelect = (id: string, value: boolean) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const answeredCount = Object.keys(answers).length;
  const isComplete = answeredCount === DEMENTIA_SELF_CHECKLIST.length;

  const yesCount = Object.values(answers).filter(Boolean).length;

  const handleSubmit = () => {
    setShowResult(true);
    soundManager.playVictorySound();
    if (yesCount >= 5) {
      soundManager.speak('자가진단 결과 인지 건강 상태가 매우 양호하십니다. 지금처럼 뇌 훈련을 꾸준히 이어가세요.');
    } else {
      soundManager.speak('자가진단 결과를 확인해보시고 두뇌 건강 습관과 체조를 실천해보세요.');
    }
  };

  const handleReset = () => {
    setAnswers({});
    setShowResult(false);
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Sub Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-stone-200/80 rounded-xl">
        <button
          onClick={() => setActiveTab('checkup')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'checkup'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>40대 인지·집중력 체크</span>
        </button>

        <button
          onClick={() => setActiveTab('gym')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'gym'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <Activity className="w-4 h-4 text-rose-600" />
          <span>데일리 3분 전두엽 체조</span>
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'tips'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-600" />
          <span>브레인 활력 3·3·3 수칙</span>
        </button>
      </div>

      {activeTab === 'checkup' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
              40대 두뇌 포커스 & 인지 활력 자가진단
            </h3>
            <p className="text-sm text-stone-600 mt-1">
              40대 일상 속 집중력, 작업 기억, 두뇌 피로도를 체크해보는 인지 진단입니다. 솔직하고 편안하게 체크해보세요.
            </p>
          </div>

          <div className="space-y-4">
            {DEMENTIA_SELF_CHECKLIST.map((item, idx) => {
              const currentVal = answers[item.id];
              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        질문 {idx + 1} ({item.category})
                      </span>
                    </div>
                    <p className="text-base font-semibold text-stone-900">
                      {item.question}
                    </p>
                    <p className="text-xs text-stone-700">
                      💡 {item.tip}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSelect(item.id, true)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${
                        currentVal === true
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      예 (그렇다)
                    </button>
                    <button
                      onClick={() => handleSelect(item.id, false)}
                      className={`px-4 py-2 rounded-lg font-bold text-sm border transition-all ${
                        currentVal === false
                          ? 'bg-rose-600 text-white border-rose-600 shadow'
                          : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                      }`}
                    >
                      아니오
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {!showResult ? (
            <div className="pt-4 flex justify-between items-center border-t">
              <span className="text-xs text-stone-500">
                진행률: {answeredCount} / {DEMENTIA_SELF_CHECKLIST.length}
              </span>
              <button
                onClick={handleSubmit}
                disabled={!isComplete}
                className={`px-6 py-3 rounded-xl font-bold text-base transition-all ${
                  isComplete
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-md'
                    : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                }`}
              >
                결과 분석 확인하기
              </button>
            </div>
          ) : (
            <div className="p-6 bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-4 animate-in fade-in">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-8 h-8 text-emerald-600 shrink-0" />
                <div>
                  <h4 className="text-xl font-black text-emerald-950">
                    자가진단 결과: &apos;양호&apos; 항목 {yesCount}개 / {DEMENTIA_SELF_CHECKLIST.length}개
                  </h4>
                  <p className="text-sm text-emerald-900 mt-1">
                    {yesCount >= 5
                      ? '기억력과 일상 인지 기능이 매우 건강하게 잘 유지되고 계십니다! 앞으로도 고스톱과 퀴즈로 두뇌를 깨워주세요.'
                      : yesCount >= 3
                      ? '대체로 양호하지만 일부 건망증이나 피로감이 있을 수 있습니다. 가벼운 산책과 손가락 체조를 매일 권장드립니다.'
                      : '기억력이나 계산에서 불편함이 다소 감지됩니다. 가까운 보건소 치매안심센터에서 무료 정밀 검진을 받아보시면 안심하실 수 있습니다.'}
                  </p>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-white border border-emerald-300 text-emerald-900 rounded-lg text-sm font-bold flex items-center gap-1 hover:bg-emerald-100"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>다시 검사하기</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'gym' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
              40대 직장인 데일리 3분 손가락 두뇌 체조
            </h3>
            <p className="text-sm text-stone-600 mt-1">
              손은 &apos;제2의 뇌&apos;라고 불립니다. 대뇌 피질의 30% 이상이 손의 움직임과 연결되어 있어, 손가락을 정교하게 움직이면 뇌 신경망이 즉각 자극되어 업무 피로가 풀립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-5 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-3">
              <span className="text-2xl">🖐️ ✊</span>
              <h4 className="font-bold text-emerald-950 text-base">
                1단계. 손가락 셈하기 반대로
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                오른손은 엄지부터 하나씩 접고, 왼손은 주먹 쥔 상태에서 새끼손가락부터 하나씩 폅니다. 양손이 서로 다른 동작을 수행할 때 뇌세포가 폭발적으로 활성화됩니다.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
              <span className="text-2xl">👏 🧠</span>
              <h4 className="font-bold text-amber-950 text-base">
                2단계. 손끝 맞부딪치기 박수
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                열 손가락의 끝(지문 부위)만을 정확히 마주대고 톡톡 30번 두드립니다. 손끝 말초 신경을 통해 뇌 중심부로 기분 좋은 혈류가 흘러들어갑니다.
              </p>
            </div>

            <div className="p-5 rounded-xl border border-purple-200 bg-purple-50/50 space-y-3">
              <span className="text-2xl">👍 ✌️</span>
              <h4 className="font-bold text-purple-950 text-base">
                3단계. 가위바위보 혼자서 이기기
              </h4>
              <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                오른손으로 먼저 바위를 내고, 왼손으로 보를 내어 &apos;왼손이 오른손을 이기게&apos; 만듭니다. 반대로 바꾸어 오른손이 이기도록 빠르게 반복합니다.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tips' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8 space-y-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-stone-900">
              40대 두뇌 건강을 위한 브레인 웰니스 3·3·3 수칙
            </h3>
            <p className="text-sm text-stone-600 mt-1">
              왕성한 사회 활동과 건강한 뇌 컨디션을 위해 일상에서 꼭 챙겨야 할 세 가지 권장, 세 가지 금지, 세 가지 행동입니다.
            </p>
          </div>

          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50">
              <h4 className="font-bold text-emerald-900 text-base mb-2">
                1. 3권 (즐길 것)
              </h4>
              <ul className="text-xs sm:text-sm text-stone-700 space-y-1 list-disc list-inside">
                <li><strong>일주일에 3번 이상 걷기:</strong> 땀이 살짝 날 정도의 유산소 걷기</li>
                <li><strong>생선과 채소 골고루 먹기:</strong> 오메가3와 신선한 항산화 채소</li>
                <li><strong>부지런히 읽고 쓰기:</strong> 퀴즈 풀기, 신문 읽기, 맞고 게임으로 뇌 쓰기</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-rose-300 bg-rose-50">
              <h4 className="font-bold text-rose-900 text-base mb-2">
                2. 3금 (참을 것)
              </h4>
              <ul className="text-xs sm:text-sm text-stone-700 space-y-1 list-disc list-inside">
                <li><strong>술은 절주하기:</strong> 과음은 뇌세포를 직접 손상시킵니다.</li>
                <li><strong>담배는 끊기:</strong> 흡연은 뇌혈관 질환 위험을 2배 높입니다.</li>
                <li><strong>머리 다치지 않게 조심하기:</strong> 낙상 주의 및 안전모 착용</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl border border-blue-300 bg-blue-50">
              <h4 className="font-bold text-blue-900 text-base mb-2">
                3. 3행 (챙길 것)
              </h4>
              <ul className="text-xs sm:text-sm text-stone-700 space-y-1 list-disc list-inside">
                <li><strong>정기 검진 받기:</strong> 혈압, 혈당, 콜레스테롤 3대 수치 관리</li>
                <li><strong>가족·친구와 자주 소통하기:</strong> 정겨운 대화와 유대감</li>
                <li><strong>매년 치매 조기검진 받기:</strong> 보건소 치매안심센터 무료 선별검사</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
