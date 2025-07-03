import { useState, useCallback } from 'react';
import { UserData, QuizStep, DiagnosisType } from '../types';
import { calculateDivineCode } from '../utils/divineCode';
import { getQuizQuestions } from '../data/quizQuestions';
import { HiddenArchitectureEngine } from '../utils/hiddenArchitecture';
import { useAnalytics } from './useAnalytics';

export function useQuizState() {
  const [currentStep, setCurrentStep] = useState<QuizStep>('landing');
  const [userData, setUserData] = useState<UserData>({
    birthDate: { day: '', month: '', year: '' },
    name: '',
    selectedColor: '',
    favoriteNumber: 0,
    divineCode: '',
    answers: {},
    diagnosis: 'financial-ceiling',
    blockPattern: ''
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [previousBlockType, setPreviousBlockType] = useState<'positive' | 'neutral' | 'negative' | null>(null);

  const { trackStepEntry, trackStepAbandonment, trackCompletion } = useAnalytics();

  const getQuestions = useCallback(() => {
    return getQuizQuestions();
  }, []);

  const updateBirthDate = useCallback((day: string, month: string, year: string) => {
    setUserData(prev => ({
      ...prev,
      birthDate: { day, month, year }
    }));
  }, []);

  const updateName = useCallback((name: string) => {
    setUserData(prev => ({
      ...prev,
      name: name.trim()
    }));
  }, []);

  const updateColor = useCallback((color: string) => {
    setUserData(prev => ({
      ...prev,
      selectedColor: color
    }));
  }, []);

  const updateFavoriteNumber = useCallback((number: number) => {
    setUserData(prev => ({
      ...prev,
      favoriteNumber: number
    }));
  }, []);

  const generateDivineCode = useCallback(() => {
    setUserData(prev => {
      const code = calculateDivineCode(
        prev.birthDate.day, 
        prev.birthDate.month, 
        prev.birthDate.year, 
        prev.selectedColor, 
        prev.favoriteNumber
      );
      return {
        ...prev,
        divineCode: code
      };
    });
  }, []);

  const updateAnswer = useCallback((questionId: string, answer: string) => {
    setUserData(prev => ({
      ...prev,
      answers: { ...prev.answers, [questionId]: answer }
    }));
  }, []);

  const calculateDiagnosis = useCallback((): DiagnosisType => {
    const psychProfile = HiddenArchitectureEngine.calculatePsychologicalProfile(userData.answers);
    return psychProfile.personalizedDiagnosis;
  }, [userData.answers]);

  const getCurrentBlockType = useCallback(() => {
    const questions = getQuestions();
    if (currentQuestionIndex >= questions.length) return 'negative';
    
    const currentQuestion = questions[currentQuestionIndex];
    return currentQuestion?.type || 'positive';
  }, [currentQuestionIndex, getQuestions]);

  // NOVA LÓGICA: Detectar mudança de bloco para mostrar transição
  const isBlockComplete = useCallback(() => {
    const questions = getQuestions();
    if (currentQuestionIndex >= questions.length - 1) return null;
    
    const currentQuestion = questions[currentQuestionIndex];
    const nextQuestion = questions[currentQuestionIndex + 1];
    
    if (!currentQuestion || !nextQuestion) return null;
    
    // Se mudou de tipo de bloco, retorna o tipo atual para mostrar transição
    if (currentQuestion.type !== nextQuestion.type) {
      return currentQuestion.type;
    }
    
    return null;
  }, [currentQuestionIndex, getQuestions]);

  const getStepNumber = useCallback(() => {
    const stepOrder: QuizStep[] = [
      'landing', 'birthdate', 'color-selection', 'name-capture', 'favorite-number', 'destiny-wheel', 'processing-code', 'code-reveal', 
      'quiz', 'block-transition', 'processing-final', 'diagnosis', 'liberation-ritual', 'wall-breaking', 'offer'
    ];
    return stepOrder.indexOf(currentStep) + 1;
  }, [currentStep]);

  const getTotalSteps = useCallback(() => {
    return 15;
  }, []);

  const nextStep = useCallback(() => {
    const stepOrder: QuizStep[] = [
      'landing', 'birthdate', 'color-selection', 'name-capture', 'favorite-number', 'destiny-wheel', 'processing-code', 'code-reveal', 
      'quiz', 'block-transition', 'processing-final', 'diagnosis', 'liberation-ritual', 'wall-breaking', 'offer'
    ];
    
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      const nextStepName = stepOrder[currentIndex + 1];
      
      // Track analytics
      trackStepEntry(nextStepName, userData);
      
      if (nextStepName === 'processing-code') {
        generateDivineCode();
      }
      
      if (nextStepName === 'diagnosis') {
        const diagnosis = calculateDiagnosis();
        setUserData(prev => ({ ...prev, diagnosis }));
      }

      if (nextStepName === 'offer') {
        trackCompletion();
      }
      
      setCurrentStep(nextStepName);
    }
  }, [currentStep, calculateDiagnosis, generateDivineCode, trackStepEntry, trackCompletion, userData]);

  const nextQuestion = useCallback(() => {
    setCurrentQuestionIndex(prev => prev + 1);
  }, []);

  // NOVA FUNÇÃO: Para lidar com transições de bloco
  const handleBlockTransition = useCallback(() => {
    const questions = getQuestions();
    const currentQuestion = questions[currentQuestionIndex];
    const nextQuestion = questions[currentQuestionIndex + 1];
    
    if (currentQuestion && nextQuestion && currentQuestion.type !== nextQuestion.type) {
      // Salvar o tipo do bloco anterior para a transição
      setPreviousBlockType(currentQuestion.type);
      setCurrentStep('block-transition');
    } else {
      // Continuar normalmente
      nextQuestion();
    }
  }, [currentQuestionIndex, getQuestions]);

  const getTransitionData = useCallback(() => {
    const questions = getQuestions();
    const nextQuestion = questions[currentQuestionIndex + 1];
    
    return {
      fromBlockType: previousBlockType,
      toBlockType: nextQuestion?.type || 'positive'
    };
  }, [currentQuestionIndex, previousBlockType, getQuestions]);

  const completeBlockTransition = useCallback(() => {
    setCurrentStep('quiz');
    nextQuestion();
    setPreviousBlockType(null);
  }, [nextQuestion]);

  return {
    currentStep,
    userData,
    currentQuestionIndex,
    setCurrentStep,
    updateBirthDate,
    updateName,
    updateColor,
    updateFavoriteNumber,
    updateAnswer,
    nextStep,
    nextQuestion,
    getCurrentBlockType,
    isBlockComplete,
    getStepNumber,
    getTotalSteps,
    getQuestions,
    handleBlockTransition,
    getTransitionData,
    completeBlockTransition
  };
}