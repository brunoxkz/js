import React, { useState, useEffect } from 'react';
import { getQuizQuestions } from '../../data/quizQuestions';
import { QuizQuestion } from '../../types';
import { HiddenArchitectureEngine } from '../../utils/hiddenArchitecture';
import { ChevronRight } from 'lucide-react';

interface QuizStepProps {
  divineCode: string;
  currentQuestionIndex: number;
  onAnswer: (questionId: string, answer: string) => void;
  onNext: () => void;
  onNextQuestion: () => void;
  onBlockTransition: () => void;
  isBlockComplete: () => string | null;
  getCurrentBlockType: () => 'positive' | 'neutral' | 'negative';
}

export function QuizStep({ 
  divineCode, 
  currentQuestionIndex, 
  onAnswer, 
  onNext,
  onNextQuestion,
  onBlockTransition,
  isBlockComplete,
  getCurrentBlockType
}: QuizStepProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  // Get questions dynamically from storage
  const quizQuestions = getQuizQuestions();
  const currentQuestion = quizQuestions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === quizQuestions.length - 1;

  const handleAnswerSelect = (answer: string) => {
    if (isTransitioning) return;
    
    setSelectedAnswer(answer);
    setIsTransitioning(true);
    onAnswer(currentQuestion.id, answer);
    
    setTimeout(() => {
      if (isLastQuestion) {
        onNext();
      } else {
        // Verificar se precisa mostrar transição de bloco
        const blockComplete = isBlockComplete();
        if (blockComplete) {
          onBlockTransition(); // Nova função para lidar com transições
        } else {
          onNextQuestion();
          setSelectedAnswer('');
          setIsTransitioning(false);
        }
      }
    }, 800);
  };

  const getStepColor = () => {
    if (currentQuestion.type === 'positive') return 'from-green-400 to-emerald-500';
    if (currentQuestion.type === 'neutral') return 'from-blue-400 to-indigo-500';
    return 'from-red-400 to-rose-500';
  };

  const getBackgroundColor = () => {
    if (currentQuestion.type === 'positive') return 'from-green-50 to-emerald-50';
    if (currentQuestion.type === 'neutral') return 'from-blue-50 to-indigo-50';
    return 'from-red-50 to-rose-50';
  };

  const getQuestionTypeLabel = () => {
    switch (currentQuestion.type) {
      case 'positive': return '✨ REVELACIÓN DE POTENCIAL';
      case 'neutral': return '🔍 ANÁLISIS DE SITUACIÓN';
      case 'negative': return '⚠️ IDENTIFICACIÓN DE BLOQUEOS';
      default: return '';
    }
  };

  // Handle case where there are no questions
  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4 py-8">
        <div className="max-w-2xl w-full">
          <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-gray-200 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              No hay preguntas disponibles
            </h3>
            <p className="text-gray-600 mb-6">
              Parece que no hay preguntas configuradas en el sistema. 
              Por favor, contacta al administrador.
            </p>
            <button
              onClick={onNext}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundColor()} flex items-center justify-center px-4 py-8 pb-24`}>
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-gray-200">
          {/* Question Type Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className={`inline-block px-6 py-3 rounded-full text-sm font-bold mb-4 ${
              currentQuestion.type === 'positive' ? 'bg-green-100 text-green-800' :
              currentQuestion.type === 'neutral' ? 'bg-blue-100 text-blue-800' : 'bg-red-100 text-red-800'
            }`}>
              {getQuestionTypeLabel()}
            </div>
          </div>

          {/* Question */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight text-center">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 md:space-y-4">
            {currentQuestion.options.map((option, index) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.value)}
                disabled={isTransitioning}
                className={`w-full text-left p-4 md:p-6 rounded-xl border-2 transition-all duration-300 transform ${
                  selectedAnswer === option.value
                    ? `border-gray-400 bg-gradient-to-r ${getStepColor()} text-white shadow-xl scale-105`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-102 active:scale-100'
                } ${isTransitioning ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
              >
                <div className="flex items-center justify-between">
                  {/* Option Text */}
                  <div className="flex-1 pr-4">
                    <span className={`font-medium text-base md:text-lg ${
                      selectedAnswer === option.value ? 'text-white' : 'text-gray-700'
                    }`}>
                      {option.text}
                    </span>
                  </div>

                  {/* Arrow Icon */}
                  <div className={`flex-shrink-0 ${
                    selectedAnswer === option.value ? 'text-white' : 'text-gray-400'
                  }`}>
                    <ChevronRight className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Instruction */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Selecciona la respuesta que mejor describe tu situación
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}