import React, { useState, useEffect } from 'react';
import { Shield, Eye, Zap, AlertTriangle } from 'lucide-react';

interface ProcessingFinalStepProps {
  onNext: () => void;
}

export function ProcessingFinalStep({ onNext }: ProcessingFinalStepProps) {
  const [currentMessage, setCurrentMessage] = useState(0);
  
  const messages = [
    { text: 'Analizando tu perfil completo...', subtext: 'Procesando todas tus respuestas', icon: Eye },
    { text: 'Identificando tu techo invisible específico...', subtext: 'Detectando patrones de bloqueo', icon: Shield },
    { text: 'Calculando tu potencial de liberación...', subtext: 'Evaluando tu capacidad de transformación', icon: Zap },
    { text: '¡Diagnóstico completo!', subtext: 'Preparando tu plan personalizado', icon: AlertTriangle }
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
    }, 1800);

    return () => clearInterval(timer);
  }, [onNext]);

  const CurrentIcon = messages[currentMessage].icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-white/20 shadow-2xl">
          {/* Divine Animation */}
          <div className="relative mb-6 md:mb-8">
            <div className="w-20 h-20 md:w-24 md:h-24 mx-auto relative">
              {/* Pulsing circles */}
              <div className="absolute inset-0 bg-red-400/20 rounded-full animate-ping"></div>
              <div className="absolute inset-2 bg-red-400/30 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute inset-4 bg-red-400/40 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              
              {/* Center icon */}
              <div className="absolute inset-0 flex items-center justify-center">
                <CurrentIcon className="w-8 h-8 md:w-10 md:h-10 text-red-400" />
              </div>
              
              {/* Rotating border */}
              <div className="absolute inset-0 border-2 border-red-400/50 rounded-full animate-spin" style={{ animationDuration: '4s' }}></div>
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
                    ? 'bg-red-400 scale-110 shadow-lg shadow-red-400/50' 
                    : 'bg-white/30'
                }`}
              />
            ))}
          </div>

          <p className="text-white/80 text-sm mt-4 md:mt-6">
            Compilando tu diagnóstico personalizado...
          </p>
        </div>
      </div>
    </div>
  );
}