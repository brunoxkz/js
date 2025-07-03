export interface AdminQuestion {
  id: string;
  type: 'positive' | 'neutral' | 'negative';
  category: string;
  question: string;
  options: AdminQuestionOption[];
  order: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AdminQuestionOption {
  id: string;
  text: string;
  value: string;
  weight: number;
}

export interface QuestionBlock {
  type: 'positive' | 'neutral' | 'negative';
  title: string;
  description: string;
  questions: AdminQuestion[];
}

export interface QuestionStats {
  totalQuestions: number;
  activeQuestions: number;
  questionsByType: Record<string, number>;
  lastModified: string;
}

export interface ImportExportData {
  questions: AdminQuestion[];
  metadata: {
    exportDate: string;
    version: string;
    totalQuestions: number;
  };
}