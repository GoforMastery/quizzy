export type Difficulty = 'EASY' | 'MEDIUM' | 'HARD';
export type QuestionType = 'MULTIPLE_CHOICE' | 'TRUE_FALSE';

export type Option = {
  id: string;
  text: string;
  isCorrect: boolean;
  questionId: string;
};

export type Question = {
  id: string;
  text: string;
  type: QuestionType;
  quizId: string;
  difficulty: Difficulty;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  options: Option[];
};

export type Quiz = {
  id: string;
  title: string;
  description: string | null;
  questionCount: number;
  timeLimit: number;
  difficulty: Difficulty;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  externalId: string | null;
  questions: Question[];
};
