import React, { useEffect, useState } from 'react';
import { Crown, Shield, AlertTriangle, Sparkles, CheckCircle, Search, ArrowRight, Heart, Zap } from 'lucide-react';

interface TransitionSettings {
  autoRedirect: boolean;
  redirectDelay: number; // em segundos
  buttonText: string;
  title: string;
  subtitle: string;
  description: string;
}

interface BlockTransitionStepProps {
  fromBlockType: 'positive' | 'neutral' | 'negative';
  toBlockType: 'positive' | 'neutral' | 'negative';
  divineCode: string;
  userName?: string;
  onNext: () => void;
}

export function BlockTransitionStep({ fromBlockType, toBlockType, divineCode, userName = '', onNext }: BlockTransitionStepProps) {
  const [showContent, setShowContent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [settings, setSettings] = useState<TransitionSettings | null>(null);

  useEffect(() => {
    // Carregar configurações das transições
    loadTransitionSettings();
    
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (settings && settings.autoRedirect && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            onNext();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown, settings, onNext]);

  const loadTransitionSettings = () => {
    try {
      const stored = localStorage.getItem('transition_settings');
      const transitionKey = `${fromBlockType}-${toBlockType}`;
      
      if (stored) {
        const allSettings = JSON.parse(stored);
        const transitionSettings = allSettings[transitionKey];
        
        if (transitionSettings) {
          setSettings(transitionSettings);
          if (transitionSettings.autoRedirect) {
            setCountdown(transitionSettings.redirectDelay);
          }
          return;
        }
      }
      
      // Configurações padrão seguindo Hidden Architecture
      const defaultSettings = getHiddenArchitectureContent();
      setSettings(defaultSettings);
      
    } catch (error) {
      console.error('Error loading transition settings:', error);
      setSettings(getHiddenArchitectureContent());
    }
  };

  const getHiddenArchitectureContent = (): TransitionSettings => {
    const transitionKey = `${fromBlockType}-${toBlockType}`;
    
    switch (transitionKey) {
      case 'positive-neutral':
        return {
          autoRedirect: true,
          redirectDelay: 3,
          buttonText: 'Continuar',
          title: '¡Increíble!',
          subtitle: '',
          description: `Tu Código Divino ${divineCode} revela un potencial extraordinario para lo que más deseas…\n\nPero incluso los códigos más poderosos pueden estar bloqueados por patrones que tú no creaste.\n\nVamos a investigar qué puede estar impidiendo que todo eso se manifieste.`
        };

      case 'neutral-negative':
        return {
          autoRedirect: true,
          redirectDelay: 3,
          buttonText: 'Continuar',
          title: 'Estamos cerca...',
          subtitle: '',
          description: `Tus respuestas revelan patrones que no aparecen en cualquier persona.\n\nJunto a tu Código ${divineCode}, forman una combinación muy específica.\n\nLo que veremos a seguir puede doler un poco.\nPero es lo que te separa de una nueva etapa.`
        };

      default:
        return {
          autoRedirect: true,
          redirectDelay: 3,
          buttonText: 'Continuar',
          title: 'Continuando...',
          subtitle: '',
          description: `Tu Código ${divineCode} está siendo analizado con precisión divina.`
        };
    }
  };

  const getTransitionIcon = () => {
    const transitionKey = `${fromBlockType}-${toBlockType}`;
    
    switch (transitionKey) {
      case 'positive-neutral': return Zap;
      case 'neutral-negative': return Heart;
      default: return Sparkles;
    }
  };

  const getColorScheme = () => {
    const transitionKey = `${fromBlockType}-${toBlockType}`;
    
    switch (transitionKey) {
      case 'positive-neutral':
        return {
          bgGradient: 'from-amber-50 via-yellow-50 to-orange-50',
          textColor: 'text-amber-800',
          iconColor: 'text-amber-600',
          buttonGradient: 'from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
        };
      case 'neutral-negative':
        return {
          bgGradient: 'from-orange-50 via-amber-50 to-yellow-50',
          textColor: 'text-orange-800',
          iconColor: 'text-orange-600',
          buttonGradient: 'from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
        };
      default:
        return {
          bgGradient: 'from-yellow-50 via-amber-50 to-orange-50',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          buttonGradient: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'
        };
    }
  };

  if (!settings) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-amber-700">Preparando revelación...</p>
        </div>
      </div>
    );
  }

  const Icon = getTransitionIcon();
  const colors = getColorScheme();

  return (
    <div className={`min-h-screen bg-gradient-to-br ${colors.bgGradient} flex items-center justify-center px-4 py-8`}>
      <div className="max-w-2xl w-full">
        <div className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 md:p-12 border border-white/50 ${
          showContent ? 'animate-fade-in' : 'opacity-0'
        }`}>
          
          {/* Ícone Central Suave */}
          <div className="text-center mb-8">
            <div className="relative w-16 h-16 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-200 to-orange-200 rounded-full animate-pulse opacity-30"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Icon className={`w-10 h-10 ${colors.iconColor}`} />
              </div>
            </div>
          </div>

          {/* Conteúdo Principal - Centralizado e Humano */}
          <div className="text-center space-y-6">
            {/* Título Grande */}
            <h1 className={`text-3xl md:text-4xl font-bold ${colors.textColor} leading-tight`}>
              {settings.title}
            </h1>

            {/* Subtítulo se existir */}
            {settings.subtitle && (
              <h2 className={`text-xl md:text-2xl font-semibold ${colors.textColor} opacity-80`}>
                {settings.subtitle}
              </h2>
            )}

            {/* Descrição com quebras de linha preservadas */}
            <div className={`text-lg md:text-xl ${colors.textColor} opacity-90 leading-relaxed space-y-4`}>
              {settings.description
                .replace('{divineCode}', divineCode)
                .replace('{nombre}', userName)
                .split('\n\n')
                .map((paragraph, index) => (
                  <p key={index} className="leading-relaxed">
                    {paragraph.split('\n').map((line, lineIndex) => (
                      <span key={lineIndex}>
                        {line}
                        {lineIndex < paragraph.split('\n').length - 1 && <br />}
                      </span>
                    ))}
                  </p>
                ))}
            </div>
          </div>

          {/* Botão ou Countdown - Discreto */}
          <div className="text-center mt-8">
            {settings.autoRedirect && countdown > 0 ? (
              <div className="space-y-4">
                <div className="text-sm text-gray-600">
                  Continuando en {countdown} segundos...
                </div>
                <button
                  onClick={onNext}
                  className={`px-6 py-2 bg-gradient-to-r ${colors.buttonGradient} text-white rounded-lg font-medium transition-all duration-300 hover:scale-105 text-sm`}
                >
                  {settings.buttonText}
                </button>
              </div>
            ) : (
              <button
                onClick={onNext}
                className={`px-8 py-3 bg-gradient-to-r ${colors.buttonGradient} text-white rounded-xl font-semibold transition-all duration-300 hover:scale-105 shadow-lg`}
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>{settings.buttonText}</span>
                  <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            )}
          </div>

          {/* Indicador de Progresso Minimalista */}
          <div className="flex justify-center space-x-1 mt-6">
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse"></div>
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
            <div className="w-1.5 h-1.5 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}