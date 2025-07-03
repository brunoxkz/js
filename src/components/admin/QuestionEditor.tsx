import React, { useState, useEffect } from 'react';
import { Save, X, Plus, Trash2, GripVertical, Wand2, ArrowLeft } from 'lucide-react';
import { AdminQuestion, AdminQuestionOption } from '../../types/admin';
import { ValidationError } from '../../utils/questionValidation';

interface QuestionEditorProps {
  question: AdminQuestion | null;
  onSave: (question: Partial<AdminQuestion>) => void;
  onCancel: () => void;
  validationErrors: ValidationError[];
}

export function QuestionEditor({ question, onSave, onCancel, validationErrors }: QuestionEditorProps) {
  const [formData, setFormData] = useState<Partial<AdminQuestion>>({
    type: 'positive',
    category: '',
    question: '',
    options: [
      { id: generateOptionId(), text: '', value: '', weight: 3 },
      { id: generateOptionId(), text: '', value: '', weight: 3 }
    ],
    isActive: true
  });

  const [draggedOption, setDraggedOption] = useState<AdminQuestionOption | null>(null);

  useEffect(() => {
    if (question) {
      setFormData(question);
    } else {
      setFormData({
        type: 'positive',
        category: '',
        question: '',
        options: [
          { id: generateOptionId(), text: '', value: '', weight: 3 },
          { id: generateOptionId(), text: '', value: '', weight: 3 }
        ],
        isActive: true
      });
    }
  }, [question]);

  function generateOptionId(): string {
    return `option-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  const getFieldError = (field: string) => {
    return validationErrors.find(error => error.field === field)?.message;
  };

  const updateFormData = (updates: Partial<AdminQuestion>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const updateOption = (index: number, updates: Partial<AdminQuestionOption>) => {
    const newOptions = [...(formData.options || [])];
    newOptions[index] = { ...newOptions[index], ...updates };
    updateFormData({ options: newOptions });
  };

  const addOption = () => {
    const newOption: AdminQuestionOption = {
      id: generateOptionId(),
      text: '',
      value: '',
      weight: 3
    };
    updateFormData({ options: [...(formData.options || []), newOption] });
  };

  const removeOption = (index: number) => {
    const newOptions = formData.options?.filter((_, i) => i !== index) || [];
    updateFormData({ options: newOptions });
  };

  const handleDragStart = (e: React.DragEvent, option: AdminQuestionOption) => {
    setDraggedOption(option);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (!draggedOption || !formData.options) {
      setDraggedOption(null);
      return;
    }

    const draggedIndex = formData.options.findIndex(opt => opt.id === draggedOption.id);
    if (draggedIndex === targetIndex) {
      setDraggedOption(null);
      return;
    }

    const newOptions = [...formData.options];
    const [removed] = newOptions.splice(draggedIndex, 1);
    newOptions.splice(targetIndex, 0, removed);

    updateFormData({ options: newOptions });
    setDraggedOption(null);
  };

  const generateValueFromText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Remove accents
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, '-')
      .substring(0, 30);
  };

  const autoGenerateValue = (index: number) => {
    const option = formData.options?.[index];
    if (option && option.text) {
      const generatedValue = generateValueFromText(option.text);
      updateOption(index, { value: generatedValue });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const getCharacterCount = (text: string, limit: number) => {
    const count = text.length;
    const isOverLimit = count > limit;
    return (
      <span className={`text-xs ${isOverLimit ? 'text-red-500' : 'text-gray-400'}`}>
        {count}/{limit}
      </span>
    );
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Enhanced Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onCancel}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {question ? 'Editar Pregunta' : 'Nueva Pregunta'}
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {question ? `Editando pregunta #${question.order}` : 'Crear una nueva pregunta para el quiz'}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* General Errors */}
          {validationErrors.filter(e => e.field === 'general').map((error, index) => (
            <div key={index} className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{error.message}</p>
            </div>
          ))}

          {/* Basic Info */}
          <div className="bg-gray-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Pregunta *
                </label>
                <select
                  value={formData.type || ''}
                  onChange={(e) => updateFormData({ type: e.target.value as any })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    getFieldError('type') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  required
                >
                  <option value="positive">✨ Positiva (Potencial/Deseos)</option>
                  <option value="neutral">🔍 Neutral (Situación Actual)</option>
                  <option value="negative">⚠️ Negativa (Problemas/Bloqueos)</option>
                </select>
                {getFieldError('type') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('type')}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  El tipo determina en qué parte del funil aparece la pregunta
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría *
                </label>
                <input
                  type="text"
                  value={formData.category || ''}
                  onChange={(e) => updateFormData({ category: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                    getFieldError('category') ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="ej: desire, vision, purpose, current, blockage"
                  required
                />
                {getFieldError('category') && (
                  <p className="mt-1 text-sm text-red-600">{getFieldError('category')}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Usado para agrupar preguntas relacionadas
                </p>
              </div>
            </div>
          </div>

          {/* Question Text */}
          <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Texto da Pregunta</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pregunta *
              </label>
              <textarea
                value={formData.question || ''}
                onChange={(e) => updateFormData({ question: e.target.value })}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                  getFieldError('question') ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Escribe la pregunta que se mostrará a los usuarios..."
                required
              />
              <div className="flex justify-between mt-1">
                {getFieldError('question') ? (
                  <p className="text-sm text-red-600">{getFieldError('question')}</p>
                ) : (
                  <p className="text-sm text-gray-500">Máximo 200 caracteres</p>
                )}
                {getCharacterCount(formData.question || '', 200)}
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="bg-green-50 rounded-xl p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Opciones de Respuesta</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Mínimo 2 opciones, máximo 6. Arrastra para reordenar.
                </p>
              </div>
              <button
                type="button"
                onClick={addOption}
                disabled={(formData.options?.length || 0) >= 6}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Opción</span>
              </button>
            </div>

            {getFieldError('options') && (
              <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
                <p className="text-red-800 text-sm">{getFieldError('options')}</p>
              </div>
            )}

            <div className="space-y-4">
              {formData.options?.map((option, index) => (
                <div
                  key={option.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, option)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`border rounded-xl p-4 bg-white shadow-sm cursor-move transition-all ${
                    draggedOption?.id === option.id ? 'opacity-50 scale-95' : 'hover:shadow-md'
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-2">
                      <GripVertical className="w-5 h-5 text-gray-400" />
                    </div>

                    <div className="flex-1 space-y-4">
                      {/* Option Header */}
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">Opción {index + 1}</h4>
                        <button
                          type="button"
                          onClick={() => removeOption(index)}
                          disabled={(formData.options?.length || 0) <= 2}
                          className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          title="Eliminar opción"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Option Text */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Texto de la Opción *
                        </label>
                        <input
                          type="text"
                          value={option.text}
                          onChange={(e) => {
                            const text = e.target.value;
                            updateOption(index, { text });
                            // Auto-generate value if it's empty
                            if (!option.value && text) {
                              updateOption(index, { value: generateValueFromText(text) });
                            }
                          }}
                          className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                            getFieldError(`options[${index}].text`) ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="Texto que verá el usuario"
                          required
                        />
                        <div className="flex justify-between mt-1">
                          {getFieldError(`options[${index}].text`) ? (
                            <p className="text-sm text-red-600">{getFieldError(`options[${index}].text`)}</p>
                          ) : (
                            <p className="text-xs text-gray-500">Máximo 150 caracteres</p>
                          )}
                          {getCharacterCount(option.text, 150)}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option Value */}
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="block text-sm font-medium text-gray-700">
                              Valor (ID interno) *
                            </label>
                            <button
                              type="button"
                              onClick={() => autoGenerateValue(index)}
                              className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                              title="Auto-generar valor"
                            >
                              <Wand2 className="w-3 h-3" />
                              <span>Auto</span>
                            </button>
                          </div>
                          <input
                            type="text"
                            value={option.value}
                            onChange={(e) => updateOption(index, { value: e.target.value })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                              getFieldError(`options[${index}].value`) ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="valor-interno"
                            required
                          />
                          {getFieldError(`options[${index}].value`) && (
                            <p className="mt-1 text-sm text-red-600">{getFieldError(`options[${index}].value`)}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Usado internamente para análise
                          </p>
                        </div>

                        {/* Option Weight */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Peso (1-5) *
                          </label>
                          <select
                            value={option.weight}
                            onChange={(e) => updateOption(index, { weight: parseInt(e.target.value) })}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent ${
                              getFieldError(`options[${index}].weight`) ? 'border-red-300' : 'border-gray-300'
                            }`}
                            required
                          >
                            <option value={1}>1 - Muy Bajo</option>
                            <option value={2}>2 - Bajo</option>
                            <option value={3}>3 - Medio</option>
                            <option value={4}>4 - Alto</option>
                            <option value={5}>5 - Muy Alto</option>
                          </select>
                          {getFieldError(`options[${index}].weight`) && (
                            <p className="mt-1 text-sm text-red-600">{getFieldError(`options[${index}].weight`)}</p>
                          )}
                          <p className="text-xs text-gray-500 mt-1">
                            Influencia na análise final
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Option Helper */}
            {(formData.options?.length || 0) < 6 && (
              <div className="mt-4 p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                <button
                  type="button"
                  onClick={addOption}
                  className="text-gray-600 hover:text-gray-800 transition-colors"
                >
                  <Plus className="w-6 h-6 mx-auto mb-2" />
                  <span className="text-sm">Agregar otra opción</span>
                </button>
              </div>
            )}
          </div>

          {/* Settings */}
          <div className="bg-purple-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Configuraciones</h3>
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <label className="font-medium text-gray-700">Pregunta activa</label>
                <p className="text-sm text-gray-600">La pregunta se mostrará en el quiz</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isActive || false}
                  onChange={(e) => updateFormData({ isActive: e.target.checked })}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <div className="text-sm text-gray-600">
              {question ? 'Editando pregunta existente' : 'Creando nueva pregunta'}
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={onCancel}
                className="px-6 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex items-center space-x-2 px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>{question ? 'Actualizar' : 'Crear'} Pregunta</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}