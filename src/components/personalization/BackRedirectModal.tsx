import React, { useState, useEffect } from 'react';
import { X, Gift, Clock, Zap, Heart, Star, ArrowRight, Crown, Shield, Check } from 'lucide-react';

interface BackRedirectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: () => void;
}

export function BackRedirectModal({ isOpen, onClose, onContinue }: BackRedirectModalProps) {
  const [countdown, setCountdown] = useState(300); // 5 minutos
  const [showBonus, setShowBonus] = useState(false);

  useEffect(() => {
    if (isOpen) {
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
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleContinue = () => {
    // Redirecionar para o checkout de $1 (SEM abrir nova aba)
    window.location.href = 'https://plan.abundancemessage.online/checkout/188833626:1';
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl shadow-2xl border-2 border-blue-200 max-w-4xl w-full p-6 md:p-8 animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            🚨 ESPERA - Estamos Creando Tu Plan Personalizado
          </h1>
          <h2 className="text-lg md:text-xl font-semibold text-blue-600 mb-4">
            Basado en los datos de navegación de tu dispositivo
          </h2>
          <p className="text-gray-700 text-base">
            Dios sabe quién eres, y esta es una oferta limitada especialmente para ti
          </p>
        </div>

        {/* Urgency Timer */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-xl text-center mb-6 animate-pulse">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="w-5 h-5 animate-bounce" />
            <span className="font-bold">OFERTA EXPIRA EN:</span>
            <Clock className="w-5 h-5 animate-bounce" />
          </div>
          <div className="text-3xl font-mono font-black">
            {formatTime(countdown)}
          </div>
        </div>

        {/* What's Included */}
        <div className="bg-white rounded-2xl p-6 mb-6 border-2 border-blue-200 shadow-lg">
          <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
            🎯 TODO LO QUE RECIBIRÁS POR SOLO $1:
          </h3>
          
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Plan Divino de 7 Días Personalizado</h4>
                  <p className="text-sm text-gray-600">Específico para tu código y situación</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Análisis Completo de Bloqueos</h4>
                  <p className="text-sm text-gray-600">Identifica exactamente qué te limita</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Oraciones de Activación Personalizadas</h4>
                  <p className="text-sm text-gray-600">Para tu código divino específico</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Técnicas de Manifestación Acelerada</h4>
                  <p className="text-sm text-gray-600">Resultados visibles en 7 días</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Guía de Implementación Paso a Paso</h4>
                  <p className="text-sm text-gray-600">Sin confusión, solo acción</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <Check className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-semibold text-gray-800">Soporte por WhatsApp 24/7</h4>
                  <p className="text-sm text-gray-600">Durante los 7 días de implementación</p>
                </div>
              </div>
            </div>
          </div>

          {/* Value Comparison */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-xl p-4 border border-yellow-200">
            <div className="text-center">
              <p className="text-gray-700 mb-2">
                <span className="text-2xl font-bold text-gray-400 line-through">Valor Normal: $297</span>
              </p>
              <p className="text-3xl font-black text-green-600 mb-2">
                HOY SOLO: $1
              </p>
              <p className="text-sm text-gray-600">
                Descuento del 99.7% - Solo por tiempo limitado
              </p>
            </div>
          </div>
        </div>

        {/* Life Transformation */}
        <div className="bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl p-6 mb-6 border-2 border-green-200">
          <h3 className="text-xl font-bold text-green-800 mb-4 text-center">
            ✨ LO QUE ESTE PLAN HARÁ EN TU VIDA:
          </h3>
          
          <div className="grid md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-green-800 mb-2">Primeros 3 Días</h4>
              <p className="text-sm text-green-700">Romperás el techo invisible y sentirás la energía fluyendo</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-green-800 mb-2">Días 4-5</h4>
              <p className="text-sm text-green-700">Oportunidades inesperadas comenzarán a manifestarse</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <h4 className="font-bold text-green-800 mb-2">Días 6-7</h4>
              <p className="text-sm text-green-700">Resultados tangibles y confirmação de tu nueva realidad</p>
            </div>
          </div>
        </div>

        {/* Guarantees */}
        <div className="bg-blue-50 rounded-xl p-6 mb-6 border-2 border-blue-200">
          <h3 className="text-lg font-bold text-blue-800 mb-4 text-center">
            🛡️ GARANTÍAS PARA TU TRANQUILIDAD:
          </h3>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800 mb-1">Garantía de Resultados en 7 Días</p>
                <p className="text-blue-700 text-sm">Si no ves cambios, devolvemos tu $1 + $10 por las molestias</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-blue-800 mb-1">100% Basado en Principios Bíblicos</p>
                <p className="text-blue-700 text-sm">Sin técnicas mundanas, solo sabiduría divina</p>
              </div>
            </div>
          </div>
        </div>

        {/* Special Bonus */}
        {showBonus && (
          <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-2xl p-6 mb-6 border-2 border-purple-200 animate-fade-in">
            <div className="text-center">
              <Gift className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-purple-800 mb-2">
                🎁 BÓNUS ESPECIAL POR ACTUAR AHORA:
              </h3>
              <p className="text-purple-700 font-medium">
                Recibirás también el "Código de Oración Personalizado" para tu situación específica (Valor: $97) - ¡GRATIS!
              </p>
            </div>
          </div>
        )}

        {/* CTA Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-5 px-8 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 text-lg"
          >
            <span className="flex items-center justify-center space-x-3">
              <Crown className="w-6 h-6" />
              <span>SÍ, QUIERO MI PLAN POR $1</span>
              <ArrowRight className="w-6 h-6" />
            </span>
          </button>
          
          <button
            onClick={onClose}
            className="w-full text-gray-600 hover:text-gray-800 font-medium py-3 px-6 rounded-lg hover:bg-gray-100 transition-colors"
          >
            No gracias, prefiero seguir luchando solo
          </button>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <span>🔒 Pago 100% Seguro</span>
            <span>✝️ Basado en la Biblia</span>
            <span>⚡ Resultados en 7 días</span>
            <span>🛡️ Garantía Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}