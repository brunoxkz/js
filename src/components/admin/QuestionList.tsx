import React, { useState } from 'react';
import { Edit, Trash2, Copy, Eye, EyeOff, GripVertical, Plus, ArrowLeft } from 'lucide-react';
import { AdminQuestion } from '../../types/admin';

interface QuestionListProps {
  questions: AdminQuestion[];
  onEdit: (question: AdminQuestion) => void;
  onDelete: (id: string) => void;
  onToggleActive: (id: string) => void;
  onDuplicate: (id: string) => void;
  onReorder: (questions: AdminQuestion[]) => void;
  onBack?: () => void;
}

export function QuestionList({
  questions,
  onEdit,
  onDelete,
  onToggleActive,
  onDuplicate,
  onReorder,
  onBack
}: QuestionListProps) {
  const [filter, setFilter] = useState<'all' | 'positive' | 'neutral' | 'negative'>('all');
  const [draggedItem, setDraggedItem] = useState<AdminQuestion | null>(null);

  const filteredQuestions = questions
    .filter(q => filter === 'all' || q.type === filter)
    .sort((a, b) => a.order - b.order);

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'positive': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-blue-100 text-blue-800';
      case 'negative': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'positive': return 'Positiva';
      case 'neutral': return 'Neutral';
      case 'negative': return 'Negativa';
      default: return type;
    }
  };

  const handleDragStart = (e: React.DragEvent, question: AdminQuestion) => {
    setDraggedItem(question);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetQuestion: AdminQuestion) => {
    e.preventDefault();
    
    if (!draggedItem || draggedItem.id === targetQuestion.id) {
      setDraggedItem(null);
      return;
    }

    const reorderedQuestions = [...questions];
    const draggedIndex = reorderedQuestions.findIndex(q => q.id === draggedItem.id);
    const targetIndex = reorderedQuestions.findIndex(q => q.id === targetQuestion.id);

    // Remove dragged item and insert at target position
    const [removed] = reorderedQuestions.splice(draggedIndex, 1);
    reorderedQuestions.splice(targetIndex, 0, removed);

    onReorder(reorderedQuestions);
    setDraggedItem(null);
  };

  const confirmDelete = (question: AdminQuestion) => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar la pregunta "${question.question}"?`)) {
      onDelete(question.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Voltar</span>
                </button>
              )}
              <h2 className="text-2xl font-bold text-gray-900">Gestão de Perguntas</h2>
            </div>
            <div className="text-sm text-gray-600">
              {filteredQuestions.length} de {questions.length} perguntas
            </div>
          </div>

          {/* Enhanced Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex space-x-2">
              {[
                { key: 'all', label: 'Todas', count: questions.length },
                { key: 'positive', label: 'Positivas', count: questions.filter(q => q.type === 'positive').length },
                { key: 'neutral', label: 'Neutrales', count: questions.filter(q => q.type === 'neutral').length },
                { key: 'negative', label: 'Negativas', count: questions.filter(q => q.type === 'negative').length }
              ].map(({ key, label, count }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key as any)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label} ({count})
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4 text-green-600" />
                <span>{questions.filter(q => q.isActive).length} ativas</span>
              </div>
              <div className="flex items-center space-x-1">
                <EyeOff className="w-4 h-4 text-gray-400" />
                <span>{questions.filter(q => !q.isActive).length} inativas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Question List */}
        <div className="divide-y divide-gray-200">
          {filteredQuestions.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay preguntas</h3>
              <p className="text-gray-600 mb-4">
                {filter === 'all' 
                  ? 'Aún no has creado ninguna pregunta.'
                  : `No hay preguntas del tipo "${getTypeLabel(filter)}".`
                }
              </p>
            </div>
          ) : (
            filteredQuestions.map((question) => (
              <div
                key={question.id}
                draggable
                onDragStart={(e) => handleDragStart(e, question)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, question)}
                className={`p-6 hover:bg-gray-50 transition-colors cursor-move ${
                  draggedItem?.id === question.id ? 'opacity-50' : ''
                } ${!question.isActive ? 'bg-gray-50/50' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 mt-1">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Order */}
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-600">{question.order}</span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(question.type)}`}>
                          {getTypeLabel(question.type)}
                        </span>
                        <span className="text-sm text-gray-500">#{question.category}</span>
                        {!question.isActive && (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                            Inactiva
                          </span>
                        )}
                      </div>
                    </div>

                    <h3 className="text-lg font-medium text-gray-900 mb-2 line-clamp-2">
                      {question.question}
                    </h3>

                    <div className="text-sm text-gray-600 mb-3">
                      {question.options.length} opciones • 
                      Actualizada: {new Date(question.updatedAt).toLocaleDateString()}
                    </div>

                    {/* Options Preview */}
                    <div className="space-y-1">
                      {question.options.slice(0, 2).map((option, index) => (
                        <div key={option.id} className="text-sm text-gray-600 truncate">
                          {index + 1}. {option.text}
                        </div>
                      ))}
                      {question.options.length > 2 && (
                        <div className="text-sm text-gray-400">
                          +{question.options.length - 2} opciones más...
                        </div>
                      )}
                    </div>

                    {/* Enhanced Metadata */}
                    <div className="mt-3 flex items-center space-x-4 text-xs text-gray-500">
                      <span>ID: {question.id.slice(-8)}</span>
                      <span>Criada: {new Date(question.createdAt).toLocaleDateString()}</span>
                      <span>Peso médio: {(question.options.reduce((sum, opt) => sum + opt.weight, 0) / question.options.length).toFixed(1)}</span>
                    </div>
                  </div>

                  {/* Enhanced Actions */}
                  <div className="flex-shrink-0 flex items-center space-x-2">
                    <button
                      onClick={() => onToggleActive(question.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        question.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                      title={question.isActive ? 'Desactivar' : 'Activar'}
                    >
                      {question.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onEdit(question)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDuplicate(question.id)}
                      className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                      title="Duplicar"
                    >
                      <Copy className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => confirmDelete(question)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Enhanced Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">
              💡 <strong>Dica:</strong> Arraste as perguntas para reordená-las. As mudanças são salvas automaticamente.
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <span>🟢 {questions.filter(q => q.type === 'positive').length} Positivas</span>
              <span>🔵 {questions.filter(q => q.type === 'neutral').length} Neutrales</span>
              <span>🔴 {questions.filter(q => q.type === 'negative').length} Negativas</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}