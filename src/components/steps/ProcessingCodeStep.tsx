import React, { useState, useEffect } from 'react';
import { Sparkles, Star, Crown } from 'lucide-react';

interface ProcessingCodeStepProps {
  onNext: () => void;
}

export function ProcessingCodeStep({ onNext }: ProcessingCodeStepProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const messages = [
    { text: 'Analizando tu fecha de nacimiento...', subtext: 'Conectando con los patrones divinos' },
    { text: 'Procesando tu color y número sagrado...', subtext: 'Calibrando tu frecuencia espiritual' },
    { text: 'Integrando tu alineación del destino...', subtext: 'Sincronizando con tu propósito divino' },
    { text: 'Calculando tu código único...', subtext: 'Revelando tu identidad espiritual' },
    { text: '¡Código identificado!', subtext: 'Preparando tu revelación personal' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentMessage(prev => {
        if (prev < messages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(timer);
          setTimeout(onNext, 1000);
          return prev;
        }
      });
    }, 1500);

    return () => clearInterval(timer);
  }, [onNext]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
          {/* Divine Animation */}
          <div className="relative mb-6 md:mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto relative">
              {/* Rotating rings */}
              <div className="absolute inset-0 border-2 border-yellow-400/30 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-2 border-yellow-400/50 rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '3s' }}></div>
              <div className="absolute inset-4 border-2 border-yellow-400/70 rounded-full animate-spin" style={{ animationDuration: '2s' }}></div>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <Crown className="w-8 h-8 md:w-10 md:h-10 text-yellow-400" />
              </div>
              
              {/* Floating stars */}
              <Star className="absolute -top-2 -right-2 w-4 h-4 text-yellow-300 animate-pulse" />
              <Sparkles className="absolute -bottom-2 -left-2 w-4 h-4 text-yellow-300 animate-pulse" style={{ animationDelay: '0.5s' }} />
              <Star className="absolute top-1/2 -left-4 w-3 h-3 text-yellow-300 animate-pulse" style={{ animationDelay: '1s' }} />
              <Sparkles className="absolute top-1/2 -right-4 w-3 h-3 text-yellow-300 animate-pulse" style={{ animationDelay: '1.5s' }} />
            </div>
          </div>

          {/* Message */}
          <div className="text-center">
            <h3 className="text-lg md:text-xl font-semibold text-white mb-2">
              {messages[currentMessage].text}
            </h3>
            <p className="text-white/80 text-sm md:text-base">
              {messages[currentMessage].subtext}
            </p>
          </div>

          {/* Progress Dots */}
          <div className="flex justify-center space-x-2 mt-6 md:mt-8">
            {messages.map((_, index) => (
              <div
                key={index}
                className={`w-2.5 h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-500 ${
                  index <= currentMessage 
                    ? 'bg-yellow-400 scale-110 shadow-lg shadow-yellow-400/50' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <p className="text-white/80 text-sm mt-4 md:mt-6">
            Procesando información sagrada...
          </p>
        </div>
      </div>
    </div>
  );
}