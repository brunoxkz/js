import { useState, useCallback, useEffect } from 'react';
import { AdminQuestion, QuestionStats } from '../types/admin';
import { QuestionStorage } from '../utils/questionStorage';
import { QuestionValidator, ValidationError } from '../utils/questionValidation';

export function useQuestionManager() {
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  // Load questions on mount
  useEffect(() => {
    loadQuestions();
  }, []);

  const loadQuestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedQuestions = QuestionStorage.load();
      setQuestions(loadedQuestions);
    } catch (err) {
      setError('Error al cargar las preguntas');
      console.error('Error loading questions:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const saveQuestions = useCallback(async (newQuestions: AdminQuestion[]) => {
    try {
      setError(null);
      
      // Validate before saving
      const errors = QuestionValidator.validateQuestionList(newQuestions);
      if (errors.length > 0) {
        setValidationErrors(errors);
        return false;
      }

      QuestionStorage.save(newQuestions);
      setQuestions(newQuestions);
      setValidationErrors([]);
      return true;
    } catch (err) {
      setError('Error al guardar las preguntas');
      console.error('Error saving questions:', err);
      return false;
    }
  }, []);

  const addQuestion = useCallback((question: Omit<AdminQuestion, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => {
    const newQuestion: AdminQuestion = {
      ...question,
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      order: questions.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const errors = QuestionValidator.validateQuestion(newQuestion);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return false;
    }

    const updatedQuestions = [...questions, newQuestion];
    return saveQuestions(updatedQuestions);
  }, [questions, saveQuestions]);

  const updateQuestion = useCallback((id: string, updates: Partial<AdminQuestion>) => {
    const questionIndex = questions.findIndex(q => q.id === id);
    if (questionIndex === -1) {
      setError('Pregunta no encontrada');
      return false;
    }

    const updatedQuestion = {
      ...questions[questionIndex],
      ...QuestionValidator.sanitizeQuestion(updates),
      updatedAt: new Date().toISOString()
    };

    const errors = QuestionValidator.validateQuestion(updatedQuestion);
    if (errors.length > 0) {
      setValidationErrors(errors);
      return false;
    }

    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex] = updatedQuestion;
    return saveQuestions(updatedQuestions);
  }, [questions, saveQuestions]);

  const deleteQuestion = useCallback((id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    return saveQuestions(updatedQuestions);
  }, [questions, saveQuestions]);

  const reorderQuestions = useCallback((newOrder: AdminQuestion[]) => {
    const reorderedQuestions = newOrder.map((question, index) => ({
      ...question,
      order: index + 1,
      updatedAt: new Date().toISOString()
    }));
    return saveQuestions(reorderedQuestions);
  }, [saveQuestions]);

  const toggleQuestionActive = useCallback((id: string) => {
    return updateQuestion(id, { 
      isActive: !questions.find(q => q.id === id)?.isActive 
    });
  }, [questions, updateQuestion]);

  const duplicateQuestion = useCallback((id: string) => {
    const originalQuestion = questions.find(q => q.id === id);
    if (!originalQuestion) {
      setError('Pregunta no encontrada');
      return false;
    }

    const duplicatedQuestion: AdminQuestion = {
      ...originalQuestion,
      id: `question-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      question: `${originalQuestion.question} (Copia)`,
      order: questions.length + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const updatedQuestions = [...questions, duplicatedQuestion];
    return saveQuestions(updatedQuestions);
  }, [questions, saveQuestions]);

  const exportQuestions = useCallback(() => {
    try {
      const exportData = QuestionStorage.export();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `divine-quiz-questions-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      return true;
    } catch (err) {
      setError('Error al exportar las preguntas');
      console.error('Error exporting questions:', err);
      return false;
    }
  }, []);

  const importQuestions = useCallback((file: File) => {
    return new Promise<boolean>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          const success = QuestionStorage.import(content);
          if (success) {
            loadQuestions();
            resolve(true);
          } else {
            setError('Formato de archivo inválido');
            resolve(false);
          }
        } catch (err) {
          setError('Error al importar las preguntas');
          console.error('Error importing questions:', err);
          resolve(false);
        }
      };
      reader.readAsText(file);
    });
  }, [loadQuestions]);

  const restoreBackup = useCallback(() => {
    try {
      const success = QuestionStorage.restore();
      if (success) {
        loadQuestions();
        return true;
      } else {
        setError('No hay backup disponible');
        return false;
      }
    } catch (err) {
      setError('Error al restaurar el backup');
      console.error('Error restoring backup:', err);
      return false;
    }
  }, [loadQuestions]);

  const getStats = useCallback((): QuestionStats => {
    const activeQuestions = questions.filter(q => q.isActive).length;
    const questionsByType = questions.reduce((acc, q) => {
      acc[q.type] = (acc[q.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const lastModified = questions.length > 0 
      ? Math.max(...questions.map(q => new Date(q.updatedAt).getTime()))
      : Date.now();

    return {
      totalQuestions: questions.length,
      activeQuestions,
      questionsByType,
      lastModified: new Date(lastModified).toISOString()
    };
  }, [questions]);

  const clearValidationErrors = useCallback(() => {
    setValidationErrors([]);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    questions,
    loading,
    error,
    validationErrors,
    loadQuestions,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    reorderQuestions,
    toggleQuestionActive,
    duplicateQuestion,
    exportQuestions,
    importQuestions,
    restoreBackup,
    getStats,
    clearValidationErrors,
    clearError
  };
}