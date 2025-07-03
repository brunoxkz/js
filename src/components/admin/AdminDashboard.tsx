import React, { useState } from 'react';
import { Settings, BarChart3, FileText, Download, Upload, RotateCcw, Plus, Eye, Palette, TrendingUp, Code, ArrowRightLeft } from 'lucide-react';
import { useQuestionManager } from '../../hooks/useQuestionManager';
import { QuestionList } from './QuestionList';
import { QuestionEditor } from './QuestionEditor';
import { QuizPreview } from './QuizPreview';
import { ImportExport } from './ImportExport';
import { VisualEditor } from './VisualEditor';
import { AnalyticsDashboard } from './AnalyticsDashboard';
import { PixelManager } from './PixelManager';
import { TransitionManager } from './TransitionManager';
import { AdminQuestion } from '../../types/admin';

type AdminView = 'dashboard' | 'analytics' | 'questions' | 'editor' | 'visual-editor' | 'preview' | 'import-export' | 'pixels' | 'transitions';

export function AdminDashboard() {
  const [currentView, setCurrentView] = useState<AdminView>('dashboard');
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(null);
  const {
    questions,
    loading,
    error,
    validationErrors,
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
  } = useQuestionManager();

  const stats = getStats();

  const handleEditQuestion = (question: AdminQuestion) => {
    setEditingQuestion(question);
    setCurrentView('editor');
  };

  const handleCreateQuestion = () => {
    setEditingQuestion(null);
    setCurrentView('editor');
  };

  const handleSaveQuestion = async (questionData: Partial<AdminQuestion>) => {
    let success = false;
    
    if (editingQuestion) {
      success = await updateQuestion(editingQuestion.id, questionData);
    } else {
      success = await addQuestion(questionData as Omit<AdminQuestion, 'id' | 'createdAt' | 'updatedAt' | 'order'>);
    }

    if (success) {
      setCurrentView('questions');
      setEditingQuestion(null);
    }
  };

  const handleSaveVisualQuestions = (updatedQuestions: AdminQuestion[]) => {
    updatedQuestions.forEach(question => {
      updateQuestion(question.id, question);
    });
    setCurrentView('questions');
  };

  const renderNavigation = () => (
    <nav className="bg-white shadow-sm border-b border-gray-200 p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-6">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <Settings className="w-8 h-8 text-yellow-600" />
            <span>Panel Administrativo</span>
          </h1>
          
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <BarChart3 className="w-4 h-4 inline mr-2" />
              Dashboard
            </button>

            <button
              onClick={() => setCurrentView('analytics')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'analytics'
                  ? 'bg-blue-100 text-blue-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Analytics
            </button>
            
            <button
              onClick={() => setCurrentView('questions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'questions'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <FileText className="w-4 h-4 inline mr-2" />
              Preguntas
            </button>

            <button
              onClick={() => setCurrentView('transitions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'transitions'
                  ? 'bg-green-100 text-green-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <ArrowRightLeft className="w-4 h-4 inline mr-2" />
              Transições
            </button>

            <button
              onClick={() => setCurrentView('visual-editor')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'visual-editor'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Palette className="w-4 h-4 inline mr-2" />
              Editor Visual
            </button>
            
            <button
              onClick={() => setCurrentView('preview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'preview'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Eye className="w-4 h-4 inline mr-2" />
              Preview
            </button>

            <button
              onClick={() => setCurrentView('pixels')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'pixels'
                  ? 'bg-purple-100 text-purple-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Code className="w-4 h-4 inline mr-2" />
              Pixels & Códigos
            </button>
            
            <button
              onClick={() => setCurrentView('import-export')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'import-export'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Download className="w-4 h-4 inline mr-2" />
              Import/Export
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleCreateQuestion}
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nueva Pregunta</span>
          </button>
        </div>
      </div>
    </nav>
  );

  const renderDashboard = () => (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Preguntas</p>
              <p className="text-3xl font-bold text-gray-900">{stats.totalQuestions}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Preguntas Activas</p>
              <p className="text-3xl font-bold text-green-600">{stats.activeQuestions}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Positivas</p>
              <p className="text-3xl font-bold text-green-600">{stats.questionsByType.positive || 0}</p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 font-bold">+</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Negativas</p>
              <p className="text-3xl font-bold text-red-600">{stats.questionsByType.negative || 0}</p>
            </div>
            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
              <span className="text-red-600 font-bold">-</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribución por Tipo</h3>
          <div className="space-y-4">
            {Object.entries(stats.questionsByType).map(([type, count]) => {
              const percentage = (count / stats.totalQuestions) * 100;
              const colors = {
                positive: 'bg-green-500',
                neutral: 'bg-blue-500',
                negative: 'bg-red-500'
              };
              
              return (
                <div key={type}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="capitalize font-medium">{type}</span>
                    <span>{count} ({percentage.toFixed(1)}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${colors[type as keyof typeof colors]}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button
              onClick={handleCreateQuestion}
              className="w-full bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Nueva Pregunta</span>
            </button>

            <button
              onClick={() => setCurrentView('analytics')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <TrendingUp className="w-4 h-4" />
              <span>Ver Analytics Completo</span>
            </button>

            <button
              onClick={() => setCurrentView('transitions')}
              className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Configurar Transições</span>
            </button>

            <button
              onClick={() => setCurrentView('visual-editor')}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Palette className="w-4 h-4" />
              <span>Editor Visual</span>
            </button>

            <button
              onClick={() => setCurrentView('pixels')}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Code className="w-4 h-4" />
              <span>Configurar Pixels</span>
            </button>
            
            <button
              onClick={exportQuestions}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Exportar Preguntas</span>
            </button>
            
            <button
              onClick={() => setCurrentView('preview')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <Eye className="w-4 h-4" />
              <span>Preview del Quiz</span>
            </button>
            
            <button
              onClick={restoreBackup}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Restaurar Backup</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-red-800">{error}</p>
          <button
            onClick={clearError}
            className="mt-2 text-red-600 hover:text-red-800 text-sm underline"
          >
            Cerrar
          </button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando preguntas...</p>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'questions':
        return (
          <QuestionList
            questions={questions}
            onEdit={handleEditQuestion}
            onDelete={deleteQuestion}
            onToggleActive={toggleQuestionActive}
            onDuplicate={duplicateQuestion}
            onReorder={reorderQuestions}
          />
        );
      case 'editor':
        return (
          <QuestionEditor
            question={editingQuestion}
            onSave={handleSaveQuestion}
            onCancel={() => {
              setCurrentView('questions');
              setEditingQuestion(null);
              clearValidationErrors();
            }}
            validationErrors={validationErrors}
          />
        );
      case 'transitions':
        return <TransitionManager />;
      case 'visual-editor':
        return (
          <VisualEditor
            questions={questions}
            onSave={handleSaveVisualQuestions}
            onClose={() => setCurrentView('questions')}
          />
        );
      case 'preview':
        return <QuizPreview questions={questions} />;
      case 'pixels':
        return <PixelManager />;
      case 'import-export':
        return (
          <ImportExport
            onExport={exportQuestions}
            onImport={importQuestions}
            onRestore={restoreBackup}
          />
        );
      default:
        return renderDashboard();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderNavigation()}
      {renderContent()}
    </div>
  );
}