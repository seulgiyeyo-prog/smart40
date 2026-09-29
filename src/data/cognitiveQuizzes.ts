import { QuizQuestion, BrainCheckupItem } from '../types/quiz';

export const COGNITIVE_QUIZZES: QuizQuestion[] = [
  // 1. 계산력 & 연산 (전두엽 수리 연산 및 작업 기억 자극)
  {
    id: 'math-1',
    category: 'math',
    categoryName: '계산력 트레이닝',
    title: '점심시간 카페 팀 음료 결제',
    storyContext: '동료들과 점심 식사 후 카페에 들러 음료를 주문했습니다.',
    question: '아메리카노 4,500원짜리 2잔과 카페라떼 5,500원짜리 1잔을 주문했습니다. 30,000원을 결제했다면 남은 잔액은 얼마일까요?',
    options: ['13,500원', '14,500원', '15,500원', '16,500원'],
    correctIndex: 2,
    explanation: '아메리카노 2잔(9,000원) + 카페라떼 1잔(5,500원) = 총 14,500원입니다. 30,000원에서 14,500원을 빼면 잔액은 15,500원입니다.',
    brainTip: '암산 계산은 뇌의 전두엽과 두정엽을 빠르게 깨워 일상 속 브레인 포그(Brain Fog)를 해소해 줍니다.',
    hint: '음료 총합은 9,000 + 5,500 = 14,500원입니다.',
    ttsQuestionText: '카페 결제 계산 문제입니다. 4천5백 원짜리 2잔과 5천5백 원짜리 1잔을 사고 3만 원을 냈을 때 잔액은 얼마일까요?'
  },
  {
    id: 'math-2',
    category: 'math',
    categoryName: '계산력 트레이닝',
    title: '작업 기억 연속 7 뺄셈',
    storyContext: '신경인지검사에서 집중력과 작업기억 용량을 측정하는 표준 연속 감산 문제입니다.',
    question: '숫자 100에서 7을 빼면 93입니다. 93에서 다시 7을 빼면 얼마일까요?',
    options: ['84', '85', '86', '87'],
    correctIndex: 2,
    explanation: '93에서 7을 빼면 86입니다. (86에서 다시 7을 빼면 79가 됩니다)',
    brainTip: '연속 뺄셈은 멀티태스킹이 많은 40대의 순간 기억 유지력과 주의집중력을 크게 끌어올려 줍니다.',
    hint: '93 - 3 = 90, 90 - 4 = ?',
    ttsQuestionText: '작업 기억 연속 뺄셈입니다. 93에서 7을 빼면 얼마일까요?'
  },
  {
    id: 'math-3',
    category: 'math',
    categoryName: '계산력 트레이닝',
    title: '팀 회식비 N분의 1 정산',
    storyContext: '프로젝트 성공 기념 팀 회식비가 총 240,000원 나왔습니다.',
    question: '총 240,000원을 6명이 똑같이 나누어 정산한다면, 1인당 부담 금액은 얼마일까요?',
    options: ['35,000원', '40,000원', '45,000원', '50,000원'],
    correctIndex: 1,
    explanation: '240,000원 ÷ 6명 = 40,000원입니다.',
    brainTip: '나눗셈 연산은 뇌의 논리적 정보 분할 처리 속도를 빠르게 만들어 줍니다.',
    hint: '24를 6으로 나누면 4입니다.',
    ttsQuestionText: '정산 문제입니다. 24만 원을 6명이 똑같이 나눈다면 1인당 얼마일까요?'
  },

  // 2. 언어 능력 & 어휘력 (측두엽 언어 회상 자극)
  {
    id: 'lang-1',
    category: 'language',
    categoryName: '언어·어휘 회상',
    title: '비즈니스 & 일상 속담 유추',
    storyContext: '대인 관계와 협업에서 언제나 통하는 명언이자 속담입니다.',
    question: '다음 속담의 빈칸에 들어갈 알맞은 말은 무엇일까요?\n"가는 말이 고와야 (  )이 곱다."',
    options: ['오는 말', '들은 말', '마음씨', '대답'],
    correctIndex: 0,
    explanation: '정답은 "오는 말"입니다. 내가 좋은 소통 태도를 보여야 상대방도 긍정적으로 반응한다는 격언입니다.',
    brainTip: '속담 회상은 장기 기억 보관소인 해마와 언어 관장 측두엽을 단단히 연결해 말문이 막히는 현상을 방지합니다.',
    hint: '내가 보낸 말에 대응하여 돌아오는 말을 뜻합니다.',
    ttsQuestionText: '속담 문제입니다. 가는 말이 고와야 빈칸이 곱다. 빈칸에 들어갈 말은 무엇일까요?'
  },
  {
    id: 'lang-2',
    category: 'language',
    categoryName: '언어·어휘 회상',
    title: '협업 시너지 명언 속담',
    storyContext: '혼자보다 함께 할 때 폭발적인 시너지가 난다는 의미의 속담입니다.',
    question: '다음 속담의 빈칸은 무엇일까요?\n"백지장도 (  ) 낫다."',
    options: ['접어야', '맞들면', '태워야', '그려야'],
    correctIndex: 1,
    explanation: '"백지장도 맞들면 낫다"는 아무리 쉬운 일이라도 팀이 함께 힘을 모으면 훨씬 스마트하게 완수할 수 있다는 뜻입니다.',
    brainTip: '친숙한 문장을 유추 완성하는 과정은 두뇌 속 단어 검색 속도를 20% 이상 향상시킵니다.',
    hint: '두 사람이 서로 양쪽을 마주 잡고 들어올릴 때를 떠올려보세요.',
    ttsQuestionText: '속담 문제입니다. 백지장도 빈칸 낫다. 빈칸에 알맞은 말은 무엇일까요?'
  },
  {
    id: 'lang-3',
    category: 'language',
    categoryName: '언어·어휘 회상',
    title: '트렌디 푸드 초성 퀴즈',
    storyContext: '퇴근 후 저녁 식사나 주말 외식으로 인기 있는 얼큰하고 구수한 찌개 요리입니다.',
    question: '다음 초성을 보고 알맞은 메뉴를 맞춰보세요!\n초성 단서: [ ㄷ ㅈ ㅉ ㄱ ]',
    options: ['동치미국', '된장찌개', '도토리묵', '단호박죽'],
    correctIndex: 1,
    explanation: '초성 [ㄷ ㅈ ㅉ ㄱ]은 "된장찌개"입니다. 차돌박이나 바지락, 두부가 어우러진 한국인의 대표 메뉴입니다.',
    brainTip: '초성 퀴즈는 자음 실마리를 바탕으로 뇌 속 어휘 사전을 초고속 스캔하는 훌륭한 뇌 트레이닝입니다.',
    hint: '콩으로 숙성한 전통 발효 장으로 끓인 찌개입니다.',
    ttsQuestionText: '초성 퀴즈입니다. 디귿, 지읒, 쌍지읒, 기역. 이 초성에 해당하는 맛있는 메뉴는 무엇일까요?'
  },

  // 3. 지남력 & 기억력 (해마 기억력 회상)
  {
    id: 'memory-1',
    category: 'memory',
    categoryName: '단기 작업기억',
    title: '회의실 준비 품목 3가지 기억',
    storyContext: '중요 미팅 전 머릿속으로 체크한 3가지 준비물입니다: [ 1. 노트북, 2. 다이어리, 3. 텀블러 ]',
    question: '방금 체크한 품목 중 첫 번째와 세 번째 물건의 조합은 무엇이었을까요?',
    options: ['노트북과 텀블러', '다이어리와 마우스', '노트북과 다이어리', '서류와 텀블러'],
    correctIndex: 0,
    explanation: '순서대로 1번 노트북, 2번 다이어리, 3번 텀블러였습니다. 따라서 첫 번째와 세 번째는 "노트북과 텀블러"입니다.',
    brainTip: '순간 기억 항목을 머릿속에 이미지로 떠올리는 시각화 습관은 40대의 기억 인출 속도를 대폭 높여줍니다.',
    hint: '1번은 업무용 PC, 3번은 음료 컵입니다.',
    ttsQuestionText: '작업기억 문제입니다. 노트북, 다이어리, 텀블러 중 첫 번째와 세 번째 물건의 바른 조합은 무엇일까요?'
  },
  {
    id: 'memory-2',
    category: 'memory',
    categoryName: '단기 작업기억',
    title: '연휴 및 계절 지남력',
    storyContext: '음력 8월 15일, 황금 연휴와 함께 보름달을 맞이하는 대표 명절입니다.',
    question: '이 명절의 이름은 무엇일까요?',
    options: ['설날', '단오', '추석(한가위)', '정월대보름'],
    correctIndex: 2,
    explanation: '음력 8월 15일은 한가위로 불리는 "추석"입니다.',
    brainTip: '날짜, 요일, 일정을 능동적으로 리마인드하는 지남력(Orientation) 루틴은 뇌의 시간 감각 센서를 깨워줍니다.',
    hint: '가을의 대명절 한가위입니다.',
    ttsQuestionText: '지남력 문제입니다. 음력 8월 15일, 보름달을 보는 우리나라 명절은 무엇일까요?'
  },

  // 4. 시공간 & 관찰력 (두정엽 공간 인지)
  {
    id: 'spatial-1',
    category: 'spatial',
    categoryName: '시공간 & 집중력',
    title: '아날로그 시계 각도 판독',
    storyContext: '디자인 벽시계의 바늘 각도를 보고 현재 시각을 판단합니다.',
    question: '시계의 짧은 시침이 숫자 3과 4의 딱 한가운데를 가리키고, 긴 분침이 숫자 6을 가리키고 있다면 몇 시 몇 분일까요?',
    options: ['3시 6분', '3시 30분', '4시 30분', '6시 15분'],
    correctIndex: 1,
    explanation: '분침이 6을 가리키면 30분이고, 시침이 3과 4 사이에 있으므로 "3시 30분"입니다.',
    brainTip: '아날로그 시계의 각도를 공간적으로 변환하는 훈련은 두정엽의 3차원 공간 지각력을 자극합니다.',
    hint: '긴 바늘이 6이면 30분입니다.',
    ttsQuestionText: '시계 판독 문제입니다. 짧은 바늘이 3과 4 사이를 가리키고, 긴 바늘이 6을 가리킬 때 시각은 몇 시 몇 분일까요?'
  },
  {
    id: 'spatial-2',
    category: 'spatial',
    categoryName: '시공간 & 집중력',
    title: '데이터 카테고리 이상치 찾기',
    storyContext: '제시된 4개 항목 중 카테고리 성격이 다른 하나를 빠르게 찾아냅니다.',
    question: '다음 중 다른 세 가지와 범주가 다른 항목은 무엇일까요?\n[ 아메리카노, 카페라떼, 카푸치노, 스니커즈 ]',
    options: ['아메리카노', '카페라떼', '카푸치노', '스니커즈'],
    correctIndex: 3,
    explanation: '아메리카노, 카페라떼, 카푸치노는 "커피 음료"이지만, 스니커즈는 "신발/의류"입니다.',
    brainTip: '사물의 패턴과 공통분모를 순발력 있게 필터링하는 훈련은 전두엽의 인지적 유연성을 길러줍니다.',
    hint: '신고 걷는 신발을 골라보세요.',
    ttsQuestionText: '카테고리 구분 문제입니다. 아메리카노, 카페라떼, 카푸치노, 스니커즈 중 종류가 다른 하나는 무엇일까요?'
  },

  // 5. 40대 두뇌 피트니스 상식
  {
    id: 'health-1',
    category: 'health',
    categoryName: '브레인 웰니스 상식',
    title: '40대 뇌 피로 회복과 브레인 포그 방지',
    storyContext: '하루 종일 업무와 모니터에 노출된 40대의 뇌 건강을 지키는 최적의 루틴입니다.',
    question: '다음 중 40대의 뇌세포 신경 가소성(Neuroplasticity)을 높이고 인지 저하를 막는 가장 좋은 습관은 무엇일까요?',
    options: [
      '수면을 4시간 이하로 줄이고 야근 지속하기',
      '수분 섭취를 제한하고 인스턴트만 먹기',
      '주 3회 30분 유산소 운동과 양질의 깊은 수면',
      '주말 내내 침대에서 스마트폰 숏폼만 연속 시청'
    ],
    correctIndex: 2,
    explanation: '규칙적인 유산소 운동(조깅, 빠른 걷기, 테니스)은 뇌 유래 신경영양인자(BDNF)를 분비시켜 기억을 담당하는 해마의 신경세포 재생을 촉진합니다.',
    brainTip: '40대에 규칙적인 운동과 숙면 루틴을 확보하면 뇌 노화 속도를 최대 10년 늦출 수 있습니다.',
    hint: '심장이 기분 좋게 뛰는 운동과 휴식입니다.',
    ttsQuestionText: '브레인 웰니스 문제입니다. 다음 중 40대의 뇌 건강에 가장 좋은 라이프스타일 습관은 무엇일까요?'
  }
];

export const DEMENTIA_SELF_CHECKLIST: BrainCheckupItem[] = [
  {
    id: 'chk-1',
    category: '작업 기억',
    question: '방금 확인한 인증번호나 전화번호 6자리를 바로 입력하기 수월한가요?',
    tip: '순간 기억을 유지하는 작업 기억(Working Memory)을 위해 듀얼 엔백 게임이나 암산 연산을 추천합니다.'
  },
  {
    id: 'chk-2',
    category: '일상 기억',
    question: '스마트폰, 자동차 차키, 무선 이어폰을 둔 위치를 즉각 떠올리시나요?',
    tip: '물건을 둘 때 1초간 마음속으로 위치를 소리 내어 말하면 뇌 속에 즉시 앵커링됩니다.'
  },
  {
    id: 'chk-3',
    category: '언어 인출',
    question: '말하려는 비즈니스 단어나 인명 등이 머뭇거림 없이 원활하게 나오나요?',
    tip: '하루 5분 독서 후 핵심 내용을 3문장으로 요약 정리하는 습관이 어휘 인출력을 지켜줍니다.'
  },
  {
    id: 'chk-4',
    category: '계산·수리',
    question: '쇼핑 결제나 더치페이 계산 시 숫자를 직관적으로 빠르게 계산하시나요?',
    tip: '스도쿠 퍼즐과 암산 계산은 뇌 전두엽 수리 신경망을 자극하는 최고의 뇌 운동입니다.'
  },
  {
    id: 'chk-5',
    category: '멀티태스킹',
    question: '동시에 여러 업무를 처리할 때 과도한 두뇌 피로감 없이 집중력을 유지하시나요?',
    tip: '집중 25분, 휴식 5분의 포모도로 루틴으로 전두엽 과부하를 예방하세요.'
  },
  {
    id: 'chk-6',
    category: '수면·멘탈',
    question: '아침에 일어났을 때 머리가 맑고, 새로운 프로젝트에 긍정적인 활력이 생기나요?',
    tip: '취침 1시간 전 스마트폰 블루라이트를 끄고 마그네슘과 따뜻한 차로 뇌를 이완시켜주세요.'
  }
];

// 40대를 위한 모던하고 미니멀한 라이프스타일 아이템 (기억력 카드 게임용 - 난이도별 확장)
export const MEMORY_CARD_ITEMS = [
  { name: '에스프레소', emoji: '☕', category: 'Life' },
  { name: '맥북', emoji: '💻', category: 'Tech' },
  { name: '헤드폰', emoji: '🎧', category: 'Audio' },
  { name: '스마트워치', emoji: '⌚', category: 'Wearable' },
  { name: '카메라', emoji: '📷', category: 'Creative' },
  { name: '여행 비행기', emoji: '✈️', category: 'Travel' },
  { name: '몬스테라', emoji: '🪴', category: 'Green' },
  { name: '전기차', emoji: '🚗', category: 'Mobility' },
  { name: '러닝화', emoji: '👟', category: 'Fitness' },
  { name: '와인글라스', emoji: '🍷', category: 'Dining' },
  { name: '테니스 라켓', emoji: '🎾', category: 'Sports' },
  { name: '여권', emoji: '🛂', category: 'Global' },
  { name: '텀블러', emoji: '🥤', category: 'Eco' },
  { name: '스마트키', emoji: '🔑', category: 'Smart' },
  { name: '골프공', emoji: '⛳', category: 'Activity' },
  { name: '북노트', emoji: '📖', category: 'Mind' }
];
