import React, { useEffect, useState } from 'react';
import { StarRating } from '../ui/StarRating';
import { CheckCircle, Search, AlertTriangle } from 'lucide-react';

interface BlockFeedbackStepProps {
  blockType: 'positive' | 'neutral' | 'negative';
  onNext: () => void;
}

export function BlockFeedbackStep({ blockType, onNext }: BlockFeedbackStepProps) {
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true);
    }, 300);

    const autoNext = setTimeout(() => {
      onNext();
    }, 3500);

    return () => {
      clearTimeout(timer);
      clearTimeout(autoNext);
    };
  }, [onNext]);

  const getBlockContent = () => {
    switch (blockType) {
      case 'positive':
        return {
          icon: CheckCircle,
          iconColor: 'text-green-600',
          bgGradient: 'from-green-50 to-emerald-50',
          borderColor: 'border-green-200',
          title: '✅ Tu corazón muestra una disposición fuerte hacia la misión divina.',
          subtitle: 'Nivel de alineación espiritual: ALTA',
          stars: 4,
          accentColor: 'text-green-800'
        };
      case 'neutral':
        return {
          icon: Search,
          iconColor: 'text-blue-600',
          bgGradient: 'from-blue-50 to-indigo-50',
          borderColor: 'border-blue-200',
          title: '🔎 Tus respuestas revelan patrones que podrían estar limitando tu avance...',
          subtitle: 'Nivel de claridad espiritual: EN PROCESO',
          stars: 3,
          accentColor: 'text-blue-800'
        };
      case 'negative':
        return {
          icon: AlertTriangle,
          iconColor: 'text-red-600',
          bgGradient: 'from-red-50 to-orange-50',
          borderColor: 'border-red-200',
          title: '⚠️ Hemos detectado un \'Techo Invisible\' que bloquea tu propósito financiero.',
          subtitle: 'Nivel de bloqueo espiritual: ELEVADO',
          stars: 2,
          accentColor: 'text-red-800'
        };
    }
  };

  const content = getBlockContent();
  const Icon = content.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${content.bgGradient} flex items-center justify-center px-4 py-8`}>
      <div className="max-w-2xl w-full">
        <div className={`bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 ${content.borderColor} ${
          showContent ? 'animate-fade-in' : 'opacity-0'
        }`}>
          {/* Icon */}
          <div className="text-center mb-6">
            <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${content.bgGradient} rounded-full flex items-center justify-center mx-auto mb-4 border-2 ${content.borderColor}`}>
              <Icon className={`w-8 h-8 md:w-10 md:h-10 ${content.iconColor}`} />
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h2 className={`text-lg md:text-xl font-bold ${content.accentColor} mb-3 leading-relaxed`}>
              {content.title}
            </h2>
            <p className={`text-base md:text-lg font-semibold ${content.accentColor} opacity-80`}>
              {content.subtitle}
            </p>
          </div>

          {/* Star Rating */}
          <div className="mb-6">
            <StarRating filled={content.stars} total={5} size="lg" />
          </div>

          {/* Progress Indicator */}
          <div className="flex justify-center space-x-2">
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>

          <p className="text-center text-gray-600 text-sm mt-4">
            Analizando tu perfil espiritual...
          </p>
        </div>
      </div>
    </div>
  );
}