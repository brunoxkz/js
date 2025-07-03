import React, { useState, useRef, useCallback } from 'react';
import { 
  Eye, Save, X, Plus, Trash2, Move, Type, Image, 
  Video, Zap, Palette, Settings, Layout, MousePointer,
  Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight,
  RotateCcw, Copy, Download, Upload
} from 'lucide-react';
import { AdminQuestion } from '../../types/admin';

interface VisualEditorProps {
  questions: AdminQuestion[];
  onSave: (questions: AdminQuestion[]) => void;
  onClose: () => void;
}

interface EditorElement {
  id: string;
  type: 'text' | 'heading' | 'button' | 'image' | 'video' | 'animation' | 'divider';
  content: string;
  styles: {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    textAlign?: string;
    borderRadius?: string;
    border?: string;
    animation?: string;
  };
  position: { x: number; y: number };
}

interface QuestionTemplate {
  id: string;
  question: string;
  elements: EditorElement[];
  options: Array<{
    id: string;
    text: string;
    value: string;
    weight: number;
    elements: EditorElement[];
  }>;
}

export function VisualEditor({ questions, onSave, onClose }: VisualEditorProps) {
  const [selectedQuestion, setSelectedQuestion] = useState<AdminQuestion | null>(
    questions.length > 0 ? questions[0] : null
  );
  const [questionTemplate, setQuestionTemplate] = useState<QuestionTemplate | null>(null);
  const [selectedElement, setSelectedElement] = useState<EditorElement | null>(null);
  const [draggedElement, setDraggedElement] = useState<EditorElement | null>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [showElementPanel, setShowElementPanel] = useState(true);
  
  const canvasRef = useRef<HTMLDivElement>(null);

  // Initialize template when question is selected
  React.useEffect(() => {
    if (selectedQuestion) {
      setQuestionTemplate({
        id: selectedQuestion.id,
        question: selectedQuestion.question,
        elements: [
          {
            id: 'main-question',
            type: 'heading',
            content: selectedQuestion.question,
            styles: {
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#1f2937',
              textAlign: 'center',
              margin: '0 0 32px 0'
            },
            position: { x: 0, y: 0 }
          }
        ],
        options: selectedQuestion.options.map(opt => ({
          ...opt,
          elements: [
            {
              id: `option-${opt.id}`,
              type: 'button',
              content: opt.text,
              styles: {
                backgroundColor: '#f3f4f6',
                color: '#374151',
                padding: '16px 20px',
                borderRadius: '12px',
                border: '2px solid #e5e7eb',
                fontSize: '16px',
                textAlign: 'left'
              },
              position: { x: 0, y: 0 }
            }
          ]
        }))
      });
    }
  }, [selectedQuestion]);

  const elementTypes = [
    { type: 'text', icon: Type, label: 'Texto' },
    { type: 'heading', icon: Type, label: 'Título' },
    { type: 'button', icon: MousePointer, label: 'Botão' },
    { type: 'image', icon: Image, label: 'Imagem' },
    { type: 'video', icon: Video, label: 'Vídeo' },
    { type: 'animation', icon: Zap, label: 'Animação' },
    { type: 'divider', icon: Layout, label: 'Divisor' }
  ];

  const animations = [
    'animate-fade-in',
    'animate-scale-in',
    'animate-bounce',
    'animate-pulse',
    'animate-ping',
    'animate-spin'
  ];

  const handleDragStart = (e: React.DragEvent, elementType: string) => {
    e.dataTransfer.setData('elementType', elementType);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const elementType = e.dataTransfer.getData('elementType');
    
    if (elementType && questionTemplate) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const newElement: EditorElement = {
          id: `element-${Date.now()}`,
          type: elementType as any,
          content: getDefaultContent(elementType),
          styles: getDefaultStyles(elementType),
          position: {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
          }
        };

        setQuestionTemplate({
          ...questionTemplate,
          elements: [...questionTemplate.elements, newElement]
        });
      }
    }
  };

  const getDefaultContent = (type: string): string => {
    switch (type) {
      case 'text': return 'Texto de exemplo';
      case 'heading': return 'Título de exemplo';
      case 'button': return 'Botão';
      case 'image': return 'https://via.placeholder.com/300x200';
      case 'video': return 'URL do vídeo';
      case 'animation': return '✨';
      case 'divider': return '';
      default: return 'Elemento';
    }
  };

  const getDefaultStyles = (type: string) => {
    const baseStyles = {
      padding: '8px',
      margin: '8px 0'
    };

    switch (type) {
      case 'heading':
        return {
          ...baseStyles,
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#1f2937'
        };
      case 'text':
        return {
          ...baseStyles,
          fontSize: '16px',
          color: '#374151'
        };
      case 'button':
        return {
          ...baseStyles,
          backgroundColor: '#3b82f6',
          color: '#ffffff',
          borderRadius: '8px',
          padding: '12px 24px',
          fontSize: '16px',
          fontWeight: '600'
        };
      case 'divider':
        return {
          ...baseStyles,
          backgroundColor: '#e5e7eb',
          height: '2px',
          margin: '16px 0'
        };
      default:
        return baseStyles;
    }
  };

  const updateElementStyle = (elementId: string, styleKey: string, value: string) => {
    if (!questionTemplate) return;

    setQuestionTemplate({
      ...questionTemplate,
      elements: questionTemplate.elements.map(el =>
        el.id === elementId
          ? { ...el, styles: { ...el.styles, [styleKey]: value } }
          : el
      )
    });
  };

  const updateElementContent = (elementId: string, content: string) => {
    if (!questionTemplate) return;

    setQuestionTemplate({
      ...questionTemplate,
      elements: questionTemplate.elements.map(el =>
        el.id === elementId ? { ...el, content } : el
      )
    });
  };

  const deleteElement = (elementId: string) => {
    if (!questionTemplate) return;

    setQuestionTemplate({
      ...questionTemplate,
      elements: questionTemplate.elements.filter(el => el.id !== elementId)
    });
    setSelectedElement(null);
  };

  const duplicateElement = (element: EditorElement) => {
    if (!questionTemplate) return;

    const newElement: EditorElement = {
      ...element,
      id: `element-${Date.now()}`,
      position: {
        x: element.position.x + 20,
        y: element.position.y + 20
      }
    };

    setQuestionTemplate({
      ...questionTemplate,
      elements: [...questionTemplate.elements, newElement]
    });
  };

  const renderElement = (element: EditorElement) => {
    const isSelected = selectedElement?.id === element.id;
    
    const elementStyle = {
      ...element.styles,
      position: 'absolute' as const,
      left: element.position.x,
      top: element.position.y,
      cursor: 'pointer',
      border: isSelected ? '2px solid #3b82f6' : '2px solid transparent',
      minWidth: '100px',
      minHeight: '30px'
    };

    const handleElementClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      setSelectedElement(element);
    };

    switch (element.type) {
      case 'text':
      case 'heading':
        return (
          <div
            key={element.id}
            style={elementStyle}
            onClick={handleElementClick}
            className={element.styles.animation || ''}
          >
            {element.content}
          </div>
        );
      
      case 'button':
        return (
          <button
            key={element.id}
            style={elementStyle}
            onClick={handleElementClick}
            className={element.styles.animation || ''}
          >
            {element.content}
          </button>
        );
      
      case 'image':
        return (
          <img
            key={element.id}
            src={element.content}
            alt="Element"
            style={elementStyle}
            onClick={handleElementClick}
            className={element.styles.animation || ''}
          />
        );
      
      case 'divider':
        return (
          <div
            key={element.id}
            style={elementStyle}
            onClick={handleElementClick}
            className={element.styles.animation || ''}
          />
        );
      
      default:
        return (
          <div
            key={element.id}
            style={elementStyle}
            onClick={handleElementClick}
            className={element.styles.animation || ''}
          >
            {element.content}
          </div>
        );
    }
  };

  const saveChanges = () => {
    if (!questionTemplate || !selectedQuestion) return;

    const updatedQuestions = questions.map(q =>
      q.id === selectedQuestion.id
        ? { ...q, question: questionTemplate.question }
        : q
    );

    onSave(updatedQuestions);
  };

  return (
    <div className="fixed inset-0 bg-gray-900 z-50 flex">
      {/* Sidebar - Question List */}
      <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Editor Visual</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className={`flex-1 flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                previewMode
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Eye className="w-4 h-4" />
              <span>{previewMode ? 'Editando' : 'Preview'}</span>
            </button>
            
            <button
              onClick={saveChanges}
              className="flex-1 flex items-center justify-center space-x-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Salvar</span>
            </button>
          </div>
        </div>

        {/* Question List */}
        <div className="flex-1 overflow-y-auto p-4">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Perguntas</h3>
          <div className="space-y-2">
            {questions.map((question) => (
              <div
                key={question.id}
                onClick={() => setSelectedQuestion(question)}
                className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                  selectedQuestion?.id === question.id
                    ? 'border-blue-300 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    question.type === 'positive' ? 'bg-green-100 text-green-800' :
                    question.type === 'neutral' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.type}
                  </span>
                  <span className="text-xs text-gray-500">#{question.order}</span>
                </div>
                <p className="text-sm text-gray-900 line-clamp-2">
                  {question.question}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Editor Area */}
      <div className="flex-1 flex">
        {/* Elements Panel */}
        {showElementPanel && !previewMode && (
          <div className="w-64 bg-gray-50 border-r border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Elementos</h3>
              <button
                onClick={() => setShowElementPanel(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              {elementTypes.map(({ type, icon: Icon, label }) => (
                <div
                  key={type}
                  draggable
                  onDragStart={(e) => handleDragStart(e, type)}
                  className="flex items-center space-x-3 p-3 bg-white rounded-lg border border-gray-200 cursor-move hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <Icon className="w-5 h-5 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700">{label}</span>
                </div>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
                Ações Rápidas
              </h4>
              <div className="space-y-2">
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  <RotateCcw className="w-4 h-4" />
                  <span>Desfazer</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  <Copy className="w-4 h-4" />
                  <span>Duplicar</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-white rounded-lg transition-colors">
                  <Download className="w-4 h-4" />
                  <span>Exportar</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className="flex-1 flex flex-col">
          {/* Toolbar */}
          {!previewMode && (
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {!showElementPanel && (
                    <button
                      onClick={() => setShowElementPanel(true)}
                      className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Elementos</span>
                    </button>
                  )}
                  
                  {selectedElement && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => duplicateElement(selectedElement)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Duplicar"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteElement(selectedElement.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Excluir"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-sm text-gray-500">
                  {selectedQuestion ? `Editando: ${selectedQuestion.question.substring(0, 50)}...` : 'Selecione uma pergunta'}
                </div>
              </div>
            </div>
          )}

          {/* Canvas Area */}
          <div className="flex-1 bg-gray-100 p-8 overflow-auto">
            <div className="max-w-4xl mx-auto">
              <div
                ref={canvasRef}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={() => setSelectedElement(null)}
                className="min-h-96 bg-white rounded-lg shadow-lg p-8 relative"
                style={{ minHeight: '600px' }}
              >
                {questionTemplate?.elements.map(renderElement)}
                
                {!previewMode && questionTemplate?.elements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    <div className="text-center">
                      <Layout className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">Canvas Vazio</p>
                      <p className="text-sm">Arraste elementos da barra lateral para começar</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Properties Panel */}
        {selectedElement && !previewMode && (
          <div className="w-80 bg-white border-l border-gray-200 p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-gray-700">Propriedades</h3>
              <button
                onClick={() => setSelectedElement(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Content */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Conteúdo
                </label>
                <textarea
                  value={selectedElement.content}
                  onChange={(e) => updateElementContent(selectedElement.id, e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                />
              </div>

              {/* Typography */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Tipografia
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Tamanho</label>
                    <input
                      type="text"
                      value={selectedElement.styles.fontSize || '16px'}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'fontSize', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="16px"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Peso</label>
                    <select
                      value={selectedElement.styles.fontWeight || 'normal'}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'fontWeight', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="normal">Normal</option>
                      <option value="bold">Negrito</option>
                      <option value="600">Semi-negrito</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Cores
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Texto</label>
                    <input
                      type="color"
                      value={selectedElement.styles.color || '#000000'}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'color', e.target.value)}
                      className="w-full h-8 border border-gray-300 rounded"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Fundo</label>
                    <input
                      type="color"
                      value={selectedElement.styles.backgroundColor || '#ffffff'}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'backgroundColor', e.target.value)}
                      className="w-full h-8 border border-gray-300 rounded"
                    />
                  </div>
                </div>
              </div>

              {/* Spacing */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Espaçamento
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Padding</label>
                    <input
                      type="text"
                      value={selectedElement.styles.padding || '8px'}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'padding', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="8px"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Margin</label>
                    <input
                      type="text"
                      value={selectedElement.styles.margin || '8px 0'}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'margin', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="8px 0"
                    />
                  </div>
                </div>
              </div>

              {/* Border & Effects */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Bordas & Efeitos
                </label>
                <div className="space-y-2">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Border Radius</label>
                    <input
                      type="text"
                      value={selectedElement.styles.borderRadius || '0px'}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'borderRadius', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                      placeholder="8px"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Animação</label>
                    <select
                      value={selectedElement.styles.animation || ''}
                      onChange={(e) => updateElementStyle(selectedElement.id, 'animation', e.target.value)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                    >
                      <option value="">Nenhuma</option>
                      {animations.map(anim => (
                        <option key={anim} value={anim}>{anim}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Alignment */}
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  Alinhamento
                </label>
                <div className="flex space-x-1">
                  <button
                    onClick={() => updateElementStyle(selectedElement.id, 'textAlign', 'left')}
                    className={`p-2 rounded ${selectedElement.styles.textAlign === 'left' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateElementStyle(selectedElement.id, 'textAlign', 'center')}
                    className={`p-2 rounded ${selectedElement.styles.textAlign === 'center' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => updateElementStyle(selectedElement.id, 'textAlign', 'right')}
                    className={`p-2 rounded ${selectedElement.styles.textAlign === 'right' ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`}
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}