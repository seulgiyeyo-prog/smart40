import React, { useState, useEffect } from 'react';
import { DEMENTIA_SELF_CHECKLIST } from '../data/cognitiveQuizzes';
import { get7DayPerformanceData, DailyPerformance, getTrainingStreak } from '../utils/brainTrendData';
import { soundManager } from '../utils/audio';
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from 'recharts';
import {
  ShieldCheck,
  TrendingUp,
  Activity,
  Sun,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Zap,
  Award,
  Brain,
  Calendar,
  Flame,
  ArrowUpRight
} from 'lucide-react';

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
    dataKey: string;
  }>;
  label?: string;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900/95 border border-slate-700/80 rounded-xl p-3 shadow-xl backdrop-blur-md text-white text-xs space-y-1.5 min-w-[170px]">
        <div className="flex items-center justify-between border-b border-slate-800 pb-1">
          <span className="font-bold text-slate-300">{label} 기록</span>
          <span className="text-[10px] text-emerald-400 font-semibold">Active</span>
        </div>
        {payload.map((entry, index) => (
          <div key={`tooltip-${index}`} className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-1.5 font-medium" style={{ color: entry.color }}>
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
              {entry.name}
            </span>
            <span className="font-mono font-bold text-white tabular-nums">
              {entry.value}{entry.dataKey === 'quizAccuracy' ? '%' : '점'}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export const BrainCheckup: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, boolean>>({});
  const [showResult, setShowResult] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'trend' | 'checkup' | 'gym' | 'tips'>('trend');
  const [performanceData, setPerformanceData] = useState<DailyPerformance[]>([]);

  useEffect(() => {
    setPerformanceData(get7DayPerformanceData());
  }, []);

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

  // Performance calculations
  const streak = getTrainingStreak();

  const validDays = performanceData.filter(d => d.memoryScore !== null && d.quizAccuracy !== null);
  const isFirstDay = validDays.length <= 1;

  const todayMetric = performanceData.find(d => d.isToday) || performanceData[performanceData.length - 1];
  const memoryScoreVal = todayMetric?.memoryScore ?? 92;
  const quizAccuracyVal = todayMetric?.quizAccuracy ?? 90;
  const compositeScoreVal = todayMetric?.compositeScore ?? 91;

  const firstValidMetric = validDays[0] || todayMetric;
  const memoryGrowth = memoryScoreVal - (firstValidMetric?.memoryScore ?? memoryScoreVal);
  const quizGrowth = quizAccuracyVal - (firstValidMetric?.quizAccuracy ?? quizAccuracyVal);

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Sub Navigation Bar */}
      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 p-1.5 bg-stone-200/80 rounded-xl">
        <button
          onClick={() => setActiveTab('trend')}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'trend'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-emerald-600" />
          <span>두뇌 퍼포먼스 7일 추이</span>
        </button>

        <button
          onClick={() => setActiveTab('checkup')}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
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
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
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
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'tips'
              ? 'bg-white text-emerald-800 shadow-sm'
              : 'text-stone-700 hover:text-stone-900'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-600" />
          <span>브레인 활력 3·3·3 수칙</span>
        </button>
      </div>

      {/* 1. Brain Performance Trend Tab (Recharts Chart) */}
      {activeTab === 'trend' && (
        <div className="space-y-6">
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>기억력 스코어</span>
                {isFirstDay ? (
                  <span className="text-emerald-700 font-bold text-[11px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/60">
                    첫 달성 🎯
                  </span>
                ) : (
                  <span className="text-emerald-600 font-bold flex items-center text-[11px]">
                    {memoryGrowth >= 0 ? `+${memoryGrowth}점` : `${memoryGrowth}점`} <ArrowUpRight className="w-3 h-3 inline" />
                  </span>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-700 tabular-nums">
                {memoryScoreVal}점
              </div>
              <p className="text-[11px] text-stone-500">모던 메모리 게임 성취도</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>퀴즈 정답률</span>
                {isFirstDay ? (
                  <span className="text-indigo-700 font-bold text-[11px] bg-indigo-50 px-1.5 py-0.5 rounded border border-indigo-200/60">
                    첫 달성 🎯
                  </span>
                ) : (
                  <span className="text-indigo-600 font-bold flex items-center text-[11px]">
                    {quizGrowth >= 0 ? `+${quizGrowth}%p` : `${quizGrowth}%p`} <ArrowUpRight className="w-3 h-3 inline" />
                  </span>
                )}
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-indigo-700 tabular-nums">
                {quizAccuracyVal}%
              </div>
              <p className="text-[11px] text-stone-500">데일리 인지 퀴즈 정확도</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>두뇌 인덱스</span>
                <span className="text-amber-600 font-bold text-[11px]">상위 8%</span>
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-stone-900 tabular-nums">
                {compositeScoreVal}점
              </div>
              <p className="text-[11px] text-stone-500">종합 인지 집중도 지수</p>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-1">
              <div className="flex items-center justify-between text-stone-500 text-xs">
                <span>연속 트레이닝</span>
                <Flame className="w-3.5 h-3.5 text-rose-500" />
              </div>
              <div className="text-2xl sm:text-3xl font-black font-mono text-rose-600 tabular-nums">
                {streak}일 째
              </div>
              <p className="text-[11px] text-stone-500">
                {streak === 1 ? '첫 발걸음 달성! 🌱' : '일일 뇌 피트니스 루틴'}
              </p>
            </div>
          </div>

          {/* Main Chart Container */}
          <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-5 sm:p-7 space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-stone-900">
                    Brain Performance Trend (최근 7일 추이)
                  </h3>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Live Analytics
                  </span>
                </div>
                <p className="text-xs text-stone-500 mt-0.5">
                  최근 7일간 모던 메모리 게임 스코어와 인지 퀴즈 정답률의 상승 추이를 분석합니다.
                </p>
              </div>

              {/* Legend Badges */}
              <div className="flex items-center gap-3 text-xs font-semibold">
                <span className="flex items-center gap-1.5 text-emerald-700">
                  <span className="w-3 h-3 rounded-sm bg-emerald-600" />
                  <span>기억력 스코어 (점)</span>
                </span>
                <span className="flex items-center gap-1.5 text-indigo-700">
                  <span className="w-3 h-1.5 rounded-full bg-indigo-600" />
                  <span>퀴즈 정답률 (%)</span>
                </span>
              </div>
            </div>

            {/* 1st Day Helpful Indicator */}
            {isFirstDay && (
              <div className="p-3 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  <strong>1일 차 두뇌 트레이닝을 시작하셨습니다!</strong> 매일 1회 이상 트레이닝을 진행하시면 최대 7일간의 두뇌 향상 곡선이 실시간으로 누적됩니다.
                </span>
              </div>
            )}

            {/* Recharts Chart View */}
            <div className="w-full h-72 sm:h-80 select-none">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart
                  data={performanceData}
                  margin={{ top: 10, right: 15, left: -15, bottom: 5 }}
                >
                  <defs>
                    {/* Emerald Area Gradient for Memory Score */}
                    <linearGradient id="memoryScoreGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />

                  <XAxis
                    dataKey="dateLabel"
                    tick={{ fill: '#78716c', fontSize: 12, fontWeight: 500 }}
                    axisLine={{ stroke: '#d6d3d1' }}
                    tickLine={false}
                  />

                  <YAxis
                    domain={[50, 100]}
                    ticks={[50, 60, 70, 80, 90, 100]}
                    tick={{ fill: '#78716c', fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                  />

                  <Tooltip content={<CustomChartTooltip />} />

                  {/* Area for Memory Score */}
                  <Area
                    type="monotone"
                    dataKey="memoryScore"
                    name="기억력 스코어"
                    stroke="#059669"
                    strokeWidth={2.5}
                    connectNulls={true}
                    fillOpacity={1}
                    fill="url(#memoryScoreGradient)"
                    dot={{ fill: '#059669', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
                  />

                  {/* Line for Quiz Accuracy */}
                  <Line
                    type="monotone"
                    dataKey="quizAccuracy"
                    name="퀴즈 정답률"
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    connectNulls={true}
                    dot={{ fill: '#4f46e5', r: 4, strokeWidth: 2, stroke: '#ffffff' }}
                    activeDot={{ r: 6, stroke: '#4f46e5', strokeWidth: 2 }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            {/* Neuroplasticity Feedback Insight */}
            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl flex items-start gap-3 text-xs sm:text-sm text-emerald-950">
              <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
                <Brain className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-emerald-900">
                  40대 전두엽 & 해마 활성화 지수 분석
                </h4>
                <p className="text-emerald-800 leading-relaxed text-xs">
                  {isFirstDay ? (
                    <>
                      🎉 <span className="font-bold">첫 번째 두뇌 피트니스를 성공적으로 완료하셨습니다!</span> 오늘 달성한 기억력 점수 <span className="font-bold font-mono">{memoryScoreVal}점</span>, 퀴즈 정확도 <span className="font-bold font-mono">{quizAccuracyVal}%</span>를 바탕으로 매일 10분간의 스도쿠 논리 추론과 모던 메모리 매칭을 이어가시면 해마의 신경 가소성(Neuroplasticity)을 자극하여 일상 속 브레인 포그를 효과적으로 걷어낼 수 있습니다.
                    </>
                  ) : (
                    <>
                      지난 <span className="font-bold font-mono">{streak}일간</span> 기억력 점수가 <span className="font-bold font-mono">{memoryGrowth >= 0 ? `+${memoryGrowth}점` : `${memoryGrowth}점`}</span>, 퀴즈 정확도가 <span className="font-bold font-mono">{quizGrowth >= 0 ? `+${quizGrowth}%p` : `${quizGrowth}%p`}</span> 변화를 나타내고 있습니다. 매일 10분간의 스도쿠 논리 추론과 모던 메모리 매칭이 해마의 신경 가소성을 자극하여 일상 속 브레인 포그를 효과적으로 걷어내고 있습니다.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Self Checkup Questionnaire Tab */}
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
                    <p className="text-sm sm:text-base font-semibold text-stone-900">
                      {item.question}
                    </p>
                    <p className="text-xs text-stone-500">
                      💡 {item.tip}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleSelect(item.id, true)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                        currentVal === true
                          ? 'bg-emerald-600 border-emerald-600 text-white shadow-sm'
                          : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      그렇다 (양호)
                    </button>
                    <button
                      onClick={() => handleSelect(item.id, false)}
                      className={`px-4 py-2 rounded-xl text-sm font-bold border transition-colors ${
                        currentVal === false
                          ? 'bg-rose-600 border-rose-600 text-white shadow-sm'
                          : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-100'
                      }`}
                    >
                      아니다 (주의)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-stone-200">
            <span className="text-xs sm:text-sm text-stone-500">
              진행 상황: <span className="font-bold text-emerald-700">{answeredCount}</span> / {DEMENTIA_SELF_CHECKLIST.length} 문항 완료
            </span>

            <button
              onClick={handleSubmit}
              disabled={!isComplete}
              className="w-full sm:w-auto px-6 py-3 bg-emerald-700 hover:bg-emerald-800 disabled:bg-stone-300 text-white font-bold rounded-xl text-sm transition-colors shadow-sm disabled:cursor-not-allowed"
            >
              자가진단 결과 확인하기
            </button>
          </div>

          {/* Results Summary Box */}
          {showResult && (
            <div className="p-6 rounded-2xl bg-emerald-50 border-2 border-emerald-500 text-stone-900 space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-600 rounded-full text-white">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-xl font-bold text-emerald-950">
                    자가진단 결과: 양호 항목 {yesCount}개 / 총 {DEMENTIA_SELF_CHECKLIST.length}개
                  </h4>
                  <p className="text-sm text-emerald-900 mt-1">
                    {yesCount >= 5
                      ? '기억력과 일상 인지 기능이 매우 건강하게 잘 유지되고 계십니다! 앞으로도 스도쿠와 퀴즈로 두뇌를 깨워주세요.'
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

      {/* 3. Daily 3-Min Executive Function Finger Gym Tab */}
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

      {/* 4. 3-3-3 Wellness Tips Tab */}
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
                <li><strong>부지런히 읽고 쓰기:</strong> 퀴즈 풀기, 신문 읽기, 스도쿠 퍼즐로 뇌 쓰기</li>
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
