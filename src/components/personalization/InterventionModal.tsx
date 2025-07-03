import React, { useState, useEffect } from 'react';
import { X, Gift, Clock, Zap, Heart, Star, ArrowRight } from 'lucide-react';

interface InterventionModalProps {
  type: 'exit-intent' | 'back-redirect' | 'engagement-boost';
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
  personalizedContent: {
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    colorScheme: 'warm' | 'cool' | 'energetic' | 'calming';
    messageStyle: 'encouraging' | 'urgent' | 'reassuring' | 'direct';
  };
  userCode?: string;
}

export function InterventionModal({ 
  type, 
  isOpen, 
  onClose, 
  onContinue, 
  personalizedContent,
  userCode = '7-3-9'
}: InterventionModalProps) {
  const [countdown, setCountdown] = useState(10);
  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    if (isOpen && type === 'exit-intent') {
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Show bonus after 3 seconds
      const bonusTimer = setTimeout(() => {
        setShowBonus(true);
      }, 3000);

      return () => {
        clearInterval(timer);
        clearTimeout(bonusTimer);
      };
    }
  }, [isOpen, type]);

  if (!isOpen) return null;

  const getContent = () => {
    switch (type) {
      case 'exit-intent':
        return {
          icon: Gift,
          title: '🚨 ESPERA! Tu Código Divino Está Casi Listo...',
          subtitle: `Solo faltan ${countdown} segundos para revelar tu código ${userCode}`,
          message: personalizedContent.messageStyle === 'urgent' 
            ? '¡No pierdas esta oportunidad única! Miles de personas están esperando acceso a esta revelación.'
            : 'Entendemos que puedes tener dudas, pero tu código divino contiene información que podría cambiar tu vida para siempre.',
          bonus: showBonus ? 'BÓNUS ESPECIAL: Si continúas ahora, recibirás un análisis GRATUITO de tu patrón de bloqueo específico (Valor: $197)' : null,
          buttonText: 'REVELAR MI CÓDIGO AHORA',
          urgentText: countdown > 0 ? `Esta ventana se cerrará en ${countdown}s` : 'Última oportunidad...'
        };

      case 'back-redirect':
        return {
          icon: Heart,
          title: '💝 Sabemos Que Esto Es Importante Para Ti',
          subtitle: 'Tu código divino ya está calculado y esperando...',
          message: personalizedContent.messageStyle === 'reassuring'
            ? 'Entendemos que tomar decisiones importantes puede generar dudas. Pero recuerda: Dios no te habría traído hasta aquí sin un propósito.'
            : 'Tu código divino contiene información específica sobre tu propósito financiero. ¿Realmente quieres irte sin conocerlo?',
          bonus: 'GARANTÍA ESPECIAL: Si no ves resultados en 7 días, te devolvemos todo tu dinero + $50 por las molestias.',
          buttonText: 'CONTINUAR CON MI REVELACIÓN',
          urgentText: 'Tu código se mantendrá reservado por 24 horas más'
        };

      case 'engagement-boost':
        return {
          icon: Zap,
          title: '⚡ Tu Energía Espiritual Está Bajando',
          subtitle: 'Pero tu código divino está generando poder...',
          message: personalizedContent.messageStyle === 'encouraging'
            ? '¡No te rindas ahora! Estás a punto de descubrir algo extraordinario sobre tu propósito divino.'
            : 'Detectamos que puedes estar perdiendo el enfoque. Tu código divino necesita tu atención completa para revelarse.',
          bonus: 'ACTIVACIÓN ESPECIAL: Completa tu análisis ahora y recibe 3 oraciones personalizadas para tu código específico.',
          buttonText: 'REACTIVAR MI ENERGÍA DIVINA',
          urgentText: 'Tu conexión espiritual se está debilitando...'
        };

      default:
        return {
          icon: Star,
          title: 'Continúa Tu Revelación',
          subtitle: '',
          message: '',
          bonus: null,
          buttonText: 'Continuar',
          urgentText: ''
        };
    }
  };

  const content = getContent();
  const Icon = content.icon;

  const getColorScheme = () => {
    const schemes = {
      warm: {
        bg: 'from-orange-50 to-red-50',
        border: 'border-orange-200',
        button: 'from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600',
        accent: 'text-orange-600',
        iconBg: 'from-orange-400 to-red-500'
      },
      energetic: {
        bg: 'from-yellow-50 to-orange-50',
        border: 'border-yellow-200',
        button: 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600',
        accent: 'text-yellow-600',
        iconBg: 'from-yellow-400 to-orange-500'
      },
      calming: {
        bg: 'from-blue-50 to-indigo-50',
        border: 'border-blue-200',
        button: 'from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600',
        accent: 'text-blue-600',
        iconBg: 'from-blue-400 to-indigo-500'
      },
      cool: {
        bg: 'from-gray-50 to-blue-50',
        border: 'border-gray-200',
        button: 'from-gray-500 to-blue-500 hover:from-gray-600 hover:to-blue-600',
        accent: 'text-gray-600',
        iconBg: 'from-gray-400 to-blue-500'
      }
    };
    return schemes[personalizedContent.colorScheme];
  };

  const colors = getColorScheme();

  const getAnimationClass = () => {
    switch (personalizedContent.urgencyLevel) {
      case 'critical':
        return 'animate-pulse';
      case 'high':
        return 'animate-bounce';
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className={`bg-gradient-to-br ${colors.bg} rounded-3xl shadow-2xl border-2 ${colors.border} max-w-lg w-full p-6 md:p-8 ${getAnimationClass()}`}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Icon */}
        <div className="text-center mb-6">
          <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${colors.iconBg} rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg`}>
            <Icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="text-center mb-6">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
            {content.title}
          </h2>
          {content.subtitle && (
            <h3 className={`text-lg md:text-xl font-semibold ${colors.accent} mb-4`}>
              {content.subtitle}
            </h3>
          )}
          <p className="text-gray-700 text-base md:text-lg leading-relaxed mb-4">
            {content.message}
          </p>
          
          {content.bonus && (
            <div className={`bg-gradient-to-r ${colors.iconBg} rounded-xl p-4 mb-4 ${showBonus ? 'animate-scale-in' : ''}`}>
              <p className="text-white font-semibold text-sm md:text-base">
                {content.bonus}
              </p>
            </div>
          )}
        </div>

        {/* Urgency indicator */}
        {content.urgentText && (
          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Clock className={`w-4 h-4 ${colors.accent}`} />
              <span className={`text-sm font-medium ${colors.accent}`}>
                {content.urgentText}
              </span>
            </div>
            {type === 'exit-intent' && countdown > 0 && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full bg-gradient-to-r ${colors.iconBg} transition-all duration-1000`}
                  style={{ width: `${(countdown / 10) * 100}%` }}
                ></div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={onContinue}
            className={`w-full bg-gradient-to-r ${colors.button} text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2`}
          >
            <span className="text-lg">{content.buttonText}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-2 px-4 rounded-lg hover:bg-white/50 transition-colors text-sm"
          >
            Tal vez más tarde
          </button>
        </div>

        {/* Trust indicators */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <span>🔒 100% Seguro</span>
            <span>✝️ Basado en la Biblia</span>
            <span>⚡ Resultados en 7 días</span>
          </div>
        </div>
      </div>
    </div>
  );
}