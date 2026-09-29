export type QuizCategory = 'memory' | 'math' | 'language' | 'spatial' | 'health';

export interface QuizQuestion {
  id: string;
  category: QuizCategory;
  categoryName: string;
  title: string;
  storyContext?: string; // 어르신을 위한 정겨운 일상 이야기 문맥
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  brainTip: string; // 치매 예방 두뇌 건강 꿀팁
  hint?: string;
  ttsQuestionText?: string;
}

export interface MemoryPairCard {
  id: string;
  pairId: number;
  name: string;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

export interface BrainCheckupItem {
  id: string;
  category: string;
  question: string;
  tip: string;
}
