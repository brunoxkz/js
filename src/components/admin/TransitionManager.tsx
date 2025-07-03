import React, { useState, useEffect } from 'react';
import { Save, RotateCcw, Settings, Clock, MousePointer, Heart, Zap, Sparkles } from 'lucide-react';

interface TransitionSettings {
  autoRedirect: boolean;
  redirectDelay: number;
  buttonText: string;
  title: string;
  subtitle: string;
  description: string;
}

interface TransitionConfig {
  'positive-neutral': TransitionSettings;
  'neutral-negative': TransitionSettings;
}

export function TransitionManager() {
  const [config, setConfig] = useState<TransitionConfig>({
    'positive-neutral': {
      autoRedirect: true,
      redirectDelay: 3,
      buttonText: 'Continuar',
      title: '¡Increíble!',
      subtitle: '',
      description: 'Tu Código Divino {divineCode} revela un potencial extraordinario para lo que más deseas…\n\nPero incluso los códigos más poderosos pueden estar bloqueados por patrones que tú no creaste.\n\nVamos a investigar qué puede estar impidiendo que todo eso se manifieste.'
    },
    'neutral-negative': {
      autoRedirect: true,
      redirectDelay: 3,
      buttonText: 'Continuar',
      title: 'Estamos cerca...',
      subtitle: '',
      description: 'Tus respuestas revelan patrones que no aparecen en cualquier persona.\n\nJunto a tu Código {divineCode}, forman una combinación muy específica.\n\nLo que veremos a seguir puede doler un poco.\nPero es lo que te separa de una nueva etapa.'
    }
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = () => {
    try {
      const stored = localStorage.getItem('transition_settings');
      if (stored) {
        const settings = JSON.parse(stored);
        setConfig(prev => ({ ...prev, ...settings }));
      }
    } catch (error) {
      console.error('Error loading transition settings:', error);
    }
  };

  const saveSettings = () => {
    try {
      localStorage.setItem('transition_settings', JSON.stringify(config));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Error saving transition settings:', error);
    }
  };

  const resetToDefaults = () => {
    if (window.confirm('¿Estás seguro de que quieres restaurar las configuraciones por defecto de Hidden Architecture?')) {
      localStorage.removeItem('transition_settings');
      setConfig({
        'positive-neutral': {
          autoRedirect: true,
          redirectDelay: 3,
          buttonText: 'Continuar',
          title: '¡Increíble!',
          subtitle: '',
          description: 'Tu Código Divino {divineCode} revela un potencial extraordinario para lo que más deseas…\n\nPero incluso los códigos más poderosos pueden estar bloqueados por patrones que tú no creaste.\n\nVamos a investigar qué puede estar impidiendo que todo eso se manifieste.'
        },
        'neutral-negative': {
          autoRedirect: true,
          redirectDelay: 3,
          buttonText: 'Continuar',
          title: 'Estamos cerca...',
          subtitle: '',
          description: 'Tus respuestas revelan patrones que no aparecen en cualquier persona.\n\nJunto a tu Código {divineCode}, forman una combinación muy específica.\n\nLo que veremos a seguir puede doler un poco.\nPero es lo que te separa de una nueva etapa.'
        }
      });
    }
  };

  const updateTransition = (transitionKey: keyof TransitionConfig, field: keyof TransitionSettings, value: any) => {
    setConfig(prev => ({
      ...prev,
      [transitionKey]: {
        ...prev[transitionKey],
        [field]: value
      }
    }));
  };

  const getTransitionInfo = (key: string) => {
    const info = {
      'positive-neutral': {
        name: 'Desejo → Reflexão',
        description: 'Transição do potencial para análise da situação atual',
        icon: Zap,
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200'
      },
      'neutral-negative': {
        name: 'Reflexão → Dor',
        description: 'Transição da situação atual para identificação de bloqueos',
        icon: Heart,
        color: 'text-orange-600',
        bgColor: 'bg-orange-50',
        borderColor: 'border-orange-200'
      }
    };
    return info[key as keyof typeof info] || {
      name: key,
      description: '',
      icon: Sparkles,
      color: 'text-gray-600',
      bgColor: 'bg-gray-50',
      borderColor: 'border-gray-200'
    };
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Transições Emocionais - Hidden Architecture</h2>
              <p className="text-gray-600">
                Configure as transições que guiam emocionalmente: Desejo → Reflexão → Dor → Ação
              </p>
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={resetToDefaults}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restaurar Padrão</span>
              </button>
              
              <button
                onClick={saveSettings}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salvar Configurações</span>
              </button>
            </div>
          </div>
          
          {saved && (
            <div className="mt-4 p-3 bg-green-100 border border-green-200 rounded-lg">
              <p className="text-green-800 font-medium">✓ Configurações salvas com sucesso!</p>
            </div>
          )}
        </div>

        {/* Hidden Architecture Principles */}
        <div className="p-6 bg-blue-50 border-b border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-3">🧠 Princípios da Hidden Architecture</h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Progressão Emocional:</h4>
              <ul className="space-y-1 text-blue-600">
                <li>• <strong>Desejo:</strong> Amplificar esperança e potencial</li>
                <li>• <strong>Reflexão:</strong> Estabelecer realidade atual</li>
                <li>• <strong>Dor:</strong> Intensificar urgência para solução</li>
                <li>• <strong>Ação:</strong> Apresentar solução como única saída</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-blue-700 mb-2">Características das Transições:</h4>
              <ul className="space-y-1 text-blue-600">
                <li>• Linguagem 100% humana e espiritual</li>
                <li>• Personalização com nome e código divino</li>
                <li>• Visual suave com tons creme/dourado</li>
                <li>• Evitar frases genéricas ou neutras</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Transition Configurations */}
        <div className="p-6 space-y-8">
          {Object.entries(config).map(([transitionKey, settings]) => {
            const info = getTransitionInfo(transitionKey);
            const Icon = info.icon;
            
            return (
              <div key={transitionKey} className={`border rounded-xl p-6 ${info.borderColor} ${info.bgColor}`}>
                <div className="flex items-center space-x-3 mb-6">
                  <Icon className={`w-6 h-6 ${info.color}`} />
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {info.name}
                    </h3>
                    <p className="text-gray-600 text-sm">{info.description}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Comportamento */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Comportamento
                    </h4>
                    
                    {/* Auto Redirect Toggle */}
                    <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
                      <div>
                        <label className="font-medium text-gray-700">Redirecionamento Automático</label>
                        <p className="text-sm text-gray-600">Continuar automaticamente (recomendado)</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.autoRedirect}
                          onChange={(e) => updateTransition(transitionKey as keyof TransitionConfig, 'autoRedirect', e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Redirect Delay */}
                    {settings.autoRedirect && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          <Clock className="w-4 h-4 inline mr-1" />
                          Tempo de Redirecionamento (segundos)
                        </label>
                        <input
                          type="number"
                          min="2"
                          max="10"
                          value={settings.redirectDelay}
                          onChange={(e) => updateTransition(transitionKey as keyof TransitionConfig, 'redirectDelay', parseInt(e.target.value))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <p className="text-xs text-gray-500 mt-1">Recomendado: 2-3 segundos para manter fluidez</p>
                      </div>
                    )}

                    {/* Button Text */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <MousePointer className="w-4 h-4 inline mr-1" />
                        Texto do Botão (se não for automático)
                      </label>
                      <input
                        type="text"
                        value={settings.buttonText}
                        onChange={(e) => updateTransition(transitionKey as keyof TransitionConfig, 'buttonText', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Continuar"
                      />
                    </div>
                  </div>

                  {/* Conteúdo */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 border-b border-gray-200 pb-2">
                      Conteúdo Emocional
                    </h4>
                    
                    {/* Title */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Título Principal (Grande e Impactante)
                      </label>
                      <input
                        type="text"
                        value={settings.title}
                        onChange={(e) => updateTransition(transitionKey as keyof TransitionConfig, 'title', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: ¡Increíble!"
                      />
                    </div>

                    {/* Subtitle */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subtítulo (Opcional)
                      </label>
                      <input
                        type="text"
                        value={settings.subtitle}
                        onChange={(e) => updateTransition(transitionKey as keyof TransitionConfig, 'subtitle', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Deixe vazio se não precisar"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Texto Principal (Use \n\n para parágrafos)
                      </label>
                      <textarea
                        value={settings.description}
                        onChange={(e) => updateTransition(transitionKey as keyof TransitionConfig, 'description', e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
                        placeholder="Use {divineCode} para inserir o código divino e {nombre} para o nome"
                      />
                      <div className="text-xs text-gray-500 mt-1 space-y-1">
                        <p>• Use {divineCode} para inserir dinamicamente o código divino</p>
                        <p>• Use {nombre} para inserir o nome do usuário</p>
                        <p>• Use \n\n para separar parágrafos</p>
                        <p>• Evite frases genéricas como "próxima etapa" ou "continue"</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200">
                  <h5 className="font-semibold text-gray-700 mb-4">Preview da Transição:</h5>
                  <div className={`bg-gradient-to-br ${
                    transitionKey === 'positive-neutral' ? 'from-amber-50 to-orange-50' : 'from-orange-50 to-amber-50'
                  } rounded-lg p-6 border`}>
                    <div className="text-center space-y-4">
                      <Icon className={`w-8 h-8 ${info.color} mx-auto`} />
                      <h6 className={`text-2xl font-bold ${info.color}`}>{settings.title}</h6>
                      {settings.subtitle && (
                        <p className={`text-lg font-semibold ${info.color} opacity-80`}>{settings.subtitle}</p>
                      )}
                      <div className={`text-base ${info.color} opacity-90 space-y-3`}>
                        {settings.description
                          .replace('{divineCode}', '7-3-9')
                          .replace('{nombre}', 'María')
                          .split('\n\n')
                          .map((paragraph, index) => (
                            <p key={index}>{paragraph}</p>
                          ))}
                      </div>
                      <div className="flex items-center justify-center space-x-4 mt-4">
                        <button className={`bg-gradient-to-r ${
                          transitionKey === 'positive-neutral' ? 'from-amber-500 to-orange-500' : 'from-orange-500 to-amber-500'
                        } text-white px-6 py-2 rounded-lg text-sm font-medium`}>
                          {settings.buttonText}
                        </button>
                        {settings.autoRedirect && (
                          <span className="text-xs text-gray-500">
                            Auto em {settings.redirectDelay}s
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Instructions */}
        <div className="p-6 border-t border-gray-200 bg-amber-50">
          <h4 className="font-semibold text-amber-800 mb-3">🎯 Diretrizes da Hidden Architecture:</h4>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h5 className="font-semibold text-amber-700 mb-2">Linguagem Humana e Espiritual:</h5>
              <ul className="text-amber-700 space-y-1">
                <li>• Evite jargões técnicos ou corporativos</li>
                <li>• Use linguagem emocional e conectiva</li>
                <li>• Personalize com nome e código divino</li>
                <li>• Mantenha tom espiritual mas não religioso demais</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-amber-700 mb-2">Progressão Emocional:</h5>
              <ul className="text-amber-700 space-y-1">
                <li>• Positivo→Neutro: Manter esperança, introduzir realidade</li>
                <li>• Neutro→Negativo: Preparar para dor, validar luta</li>
                <li>• Cada transição deve intensificar o envolvimento</li>
                <li>• Criar antecipação para a próxima revelação</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}