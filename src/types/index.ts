export interface UserData {
  birthDate: {
    day: string;
    month: string;
    year: string;
  };
  name: string;
  selectedColor: string;
  favoriteNumber: number;
  divineCode: string;
  answers: Record<string, string>;
  diagnosis: DiagnosisType;
  blockPattern: string;
}

export interface QuizQuestion {
  id: string;
  type: 'positive' | 'neutral' | 'negative';
  question: string;
  options: QuizOption[];
  category: string;
}

export interface QuizOption {
  id: string;
  text: string;
  value: string;
  weight: number;
}

export type DiagnosisType = 
  | 'financial-ceiling'
  | 'spiritual-blockage'
  | 'purpose-misalignment'
  | 'generational-curse'
  | 'divine-timing';

export type QuizStep = 
  | 'landing'
  | 'birthdate'
  | 'color-selection'
  | 'name-capture'
  | 'favorite-number'
  | 'destiny-wheel'
  | 'processing-code'
  | 'code-reveal'
  | 'quiz'
  | 'block-transition'
  | 'processing-final'
  | 'diagnosis'
  | 'liberation-ritual'
  | 'wall-breaking'
  | 'offer';