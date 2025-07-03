import React, { useState } from 'react';
import { User, Sparkles, Crown, Star } from 'lucide-react';

interface NameCaptureStepProps {
  onNext: () => void;
  onUpdateName: (name: string) => void;
  selectedColor: string;
}

export function NameCaptureStep({ onNext, onUpdateName, selectedColor }: NameCaptureStepProps) {
  const [name, setName] = useState('');

  const getColorGradient = () => {
    const colorGradients: Record<string, string> = {
      red: 'from-red-500 to-red-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-orange-500',
      purple: 'from-purple-500 to-purple-600',
      pink: 'from-pink-500 to-pink-600',
      orange: 'from-orange-500 to-orange-600',
      teal: 'from-teal-500 to-teal-600'
    };
    return colorGradients[selectedColor] || 'from-purple-500 to-purple-600';
  };

  const handleNameChange = (value: string) => {
    setName(value);
    onUpdateName(value); // Salva o nome no estado global
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onNext();
    }
  };

  const colorGradient = getColorGradient();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 pb-24">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            {/* Ícone com brilhos animados */}
            <div className="relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-4">
              {/* Ícone principal */}
              <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${colorGradient} rounded-full flex items-center justify-center shadow-2xl`}>
                <User className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              
              {/* Brilhos pulsantes ao redor do ícone */}
              <div className="absolute inset-0">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      top: '50%',
                      left: '50%',
                      transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${35 + i * 2}px)`,
                    }}
                  >
                    <Sparkles 
                      className={`w-3 h-3 md:w-4 md:h-4 text-yellow-400 animate-pulse`}
                      style={{ 
                        animationDelay: `${i * 0.2}s`,
                        animationDuration: '1.5s'
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* Brilhos menores que se movem */}
              <div className="absolute inset-0">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={`star-${i}`}
                    className="absolute animate-bounce"
                    style={{
                      top: `${20 + Math.random() * 60}%`,
                      left: `${20 + Math.random() * 60}%`,
                      animationDelay: `${i * 0.3}s`,
                      animationDuration: `${2 + Math.random()}s`
                    }}
                  >
                    <Star className="w-2 h-2 text-yellow-300" />
                  </div>
                ))}
              </div>

              {/* Anel de luz pulsante */}
              <div className="absolute -inset-4 rounded-full border-2 border-yellow-400/30 animate-ping"></div>
              <div className="absolute -inset-6 rounded-full border-2 border-yellow-300/20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            </div>
            
            {/* FOCO PRINCIPAL: Tu nombre activará */}
            <div className="relative inline-block mb-4">
              <h2 className={`text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${colorGradient.replace('from-', 'from-').replace('to-', 'to-')}`}>
                TU NOMBRE ACTIVARÁ
              </h2>
              <Crown className="absolute -top-2 -right-6 md:-right-8 w-6 h-6 md:w-8 md:h-8 text-indigo-500 animate-pulse" />
            </div>
            
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
              una conexión personal con tu código divino
            </h3>
            
            <p className="text-gray-600 text-sm md:text-base">
              Tu identidad espiritual será vinculada a tu frecuencia única
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-lg font-semibold text-gray-700 mb-3">
                ¿Cuál es tu nombre?
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="Escribe tu nombre aquí..."
                className={`w-full px-4 py-4 border-2 rounded-xl focus:ring-2 focus:ring-opacity-50 transition-all text-lg font-medium ${
                  name.trim() 
                    ? `border-indigo-300 focus:border-transparent focus:ring-indigo-500 bg-gradient-to-r ${colorGradient.replace('from-', 'from-').replace('to-', 'to-')}/5`
                    : 'border-gray-300 focus:border-indigo-300 focus:ring-indigo-200'
                }`}
                required
              />
              
              {name.trim() && (
                <div className="mt-3 animate-fade-in">
                  <div className={`bg-gradient-to-r ${colorGradient} rounded-lg p-4 text-white`}>
                    <p className="font-semibold text-center">
                      ✨ ¡Hola {name}! Tu energía espiritual está resonando ✨
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Continue Button */}
            {name.trim() && (
              <button
                type="submit"
                className={`w-full bg-gradient-to-r ${colorGradient} hover:opacity-90 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg shadow-lg animate-fade-in`}
              >
                CONTINUAR MI EXPERIENCIA DIVINA
              </button>
            )}
          </form>

          {/* Trust Indicators */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
              <span>🔒 100% Privado</span>
              <span>✨ Personalizado</span>
              <span>🎯 Experiencia Única</span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA Button */}
      {name.trim() && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-indigo-200 p-4 shadow-lg z-50">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleSubmit}
              className={`w-full bg-gradient-to-r ${colorGradient} hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}
            >
              <span className="relative flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-lg">ACTIVAR MI EXPERIENCIA</span>
                <Sparkles className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}