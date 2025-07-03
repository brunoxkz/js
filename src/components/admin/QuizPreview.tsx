import React, { useState } from 'react';
import { Play, RotateCcw, Eye } from 'lucide-react';
import { AdminQuestion } from '../../types/admin';
import { QuestionStorage } from '../../utils/questionStorage';

interface QuizPreviewProps {
  questions: AdminQuestion[];
}

export function QuizPreview({ questions }: QuizPreviewProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  const activeQuestions = QuestionStorage.convertToQuizFormat(questions);
  const currentQuestion = activeQuestions[currentQuestionIndex];

  const handleAnswerSelect = (value: string) => {
    if (!currentQuestion) return;
    
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: value
    }));
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < activeQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const resetPreview = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'from-green-50 to-emerald-50';
      case 'neutral': return 'from-blue-50 to-indigo-50';
      case 'negative': return 'from-red-50 to-rose-50';
      default: return 'from-gray-50 to-gray-100';
    }
  };

  const getStepColor = (type: string) => {
    switch (type) {
      case 'positive': return 'from-green-400 to-emerald-500';
      case 'neutral': return 'from-blue-400 to-indigo-500';
      case 'negative': return 'from-red-400 to-rose-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  if (!isPreviewMode) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Preview del Quiz</h2>
                <p className="text-gray-600 mt-1">
                  Prueba cómo se verá el quiz para los usuarios
                </p>
              </div>
              <button
                onClick={() => setIsPreviewMode(true)}
                className="flex items-center space-x-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
              >
                <Play className="w-4 h-4" />
                <span>Iniciar Preview</span>
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-green-800">Preguntas Positivas</p>
                    <p className="text-2xl font-bold text-green-900">
                      {questions.filter(q => q.type === 'positive' && q.isActive).length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-green-200 rounded-full flex items-center justify-center">
                    <span className="text-green-800 font-bold">+</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-blue-800">Preguntas Neutrales</p>
                    <p className="text-2xl font-bold text-blue-900">
                      {questions.filter(q => q.type === 'neutral' && q.isActive).length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                    <span className="text-blue-800 font-bold">~</span>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-red-800">Preguntas Negativas</p>
                    <p className="text-2xl font-bold text-red-900">
                      {questions.filter(q => q.type === 'negative' && q.isActive).length}
                    </p>
                  </div>
                  <div className="w-8 h-8 bg-red-200 rounded-full flex items-center justify-center">
                    <span className="text-red-800 font-bold">-</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-yellow-50 rounded-lg p-4 border border-yellow-200">
              <div className="flex items-start space-x-3">
                <Eye className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h3 className="font-medium text-yellow-800">Información del Preview</h3>
                  <p className="text-yellow-700 text-sm mt-1">
                    El preview te permitirá navegar por todas las preguntas activas tal como las verían los usuarios.
                    Solo se mostrarán las preguntas marcadas como "activas".
                  </p>
                </div>
              </div>
            </div>

            {activeQuestions.length === 0 && (
              <div className="mt-6 bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="text-center">
                  <h3 className="font-medium text-red-800 mb-2">No hay preguntas activas</h3>
                  <p className="text-red-700 text-sm">
                    Necesitas tener al menos una pregunta activa para poder hacer el preview del quiz.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No hay preguntas para mostrar</h3>
          <p className="text-gray-600 mb-4">Asegúrate de tener preguntas activas en el sistema.</p>
          <button
            onClick={() => setIsPreviewMode(false)}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Volver al Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getTypeColor(currentQuestion.type)} flex items-center justify-center px-4 py-8`}>
      <div className="max-w-3xl w-full">
        {/* Preview Controls */}
        <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPreviewMode(false)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span className="text-sm font-medium">Salir del Preview</span>
              </button>
              
              <div className="text-sm text-gray-600">
                Pregunta {currentQuestionIndex + 1} de {activeQuestions.length}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                Anterior
              </button>
              
              <button
                onClick={resetPreview}
                className="p-1 text-gray-600 hover:text-gray-900 transition-colors"
                title="Reiniciar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
              
              <button
                onClick={nextQuestion}
                disabled={currentQuestionIndex === activeQuestions.length - 1}
                className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>

        {/* Question Preview */}
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border-2 border-gray-200">
          {/* Question */}
          <div className="mb-6 md:mb-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className={`px-3 py-1 text-sm font-medium rounded-full ${
                currentQuestion.type === 'positive' ? 'bg-green-100 text-green-800' :
                currentQuestion.type === 'neutral' ? 'bg-blue-100 text-blue-800' :
                'bg-red-100 text-red-800'
              }`}>
                {currentQuestion.type === 'positive' ? 'Positiva' :
                 currentQuestion.type === 'neutral' ? 'Neutral' : 'Negativa'}
              </span>
              <span className="text-sm text-gray-500">#{currentQuestion.category}</span>
            </div>
            
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
              {currentQuestion.question}
            </h2>
          </div>

          {/* Options */}
          <div className="space-y-3 md:space-y-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleAnswerSelect(option.value)}
                className={`w-full text-left p-4 md:p-5 rounded-xl border-2 transition-all duration-200 transform ${
                  selectedAnswers[currentQuestion.id] === option.value
                    ? `border-gray-400 bg-gradient-to-r ${getStepColor(currentQuestion.type)} text-white shadow-lg scale-105`
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 hover:scale-102 active:scale-100'
                } cursor-pointer`}
              >
                <div className="flex items-start space-x-3">
                  <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                    selectedAnswers[currentQuestion.id] === option.value
                      ? 'border-white bg-white'
                      : 'border-gray-300'
                  }`}>
                    {selectedAnswers[currentQuestion.id] === option.value && (
                      <div className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-gradient-to-r ${getStepColor(currentQuestion.type)}`}></div>
                    )}
                  </div>
                  <span className={`font-medium text-sm md:text-base ${
                    selectedAnswers[currentQuestion.id] === option.value ? 'text-white' : 'text-gray-700'
                  }`}>
                    {option.text}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Progress */}
          <div className="mt-6 md:mt-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progreso</span>
              <span>{Math.round(((currentQuestionIndex + 1) / activeQuestions.length) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full bg-gradient-to-r ${getStepColor(currentQuestion.type)} transition-all duration-300`}
                style={{ width: `${((currentQuestionIndex + 1) / activeQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}