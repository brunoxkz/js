import { QuizQuestion } from '../types';
import { QuestionStorage } from '../utils/questionStorage';

// This function now loads questions dynamically from storage
export function getQuizQuestions(): QuizQuestion[] {
  return QuestionStorage.convertToQuizFormat(QuestionStorage.load());
}

// Keep the original export for backward compatibility
export const quizQuestions: QuizQuestion[] = getQuizQuestions();