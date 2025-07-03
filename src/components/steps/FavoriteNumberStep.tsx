import React, { useState } from 'react';
import { Hash, Sparkles, Star } from 'lucide-react';

interface FavoriteNumberStepProps {
  onNext: () => void;
  onUpdateNumber: (number: number) => void;
  selectedColor: string;
}

export function FavoriteNumberStep({ onNext, onUpdateNumber, selectedColor }: FavoriteNumberStepProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);

  const numbers = [
    { value: 1, meaning: 'Liderazgo y Nuevos Comienzos', energy: 'Pionero' },
    { value: 2, meaning: 'Cooperación y Equilibrio', energy: 'Diplomático' },
    { value: 3, meaning: 'Creatividad y Expresión', energy: 'Artístico' },
    { value: 4, meaning: 'Estabilidad y Organización', energy: 'Constructor' },
    { value: 5, meaning: 'Libertad y Aventura', energy: 'Explorador' },
    { value: 6, meaning: 'Responsabilidad y Cuidado', energy: 'Sanador' },
    { value: 7, meaning: 'Espiritualidad y Sabiduría', energy: 'Místico' },
    { value: 8, meaning: 'Poder Material y Logros', energy: 'Ejecutivo' },
    { value: 9, meaning: 'Compasión Universal', energy: 'Humanitario' }
  ];

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

  const handleNumberSelect = (number: number) => {
    setSelectedNumber(number);
    onUpdateNumber(number);
  };

  const handleSubmit = () => {
    if (selectedNumber !== null) {
      onNext();
    }
  };

  const selectedNumberData = numbers.find(n => n.value === selectedNumber);
  const colorGradient = getColorGradient();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 pb-24">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-indigo-200">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className={`w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br ${colorGradient} rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Hash className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              ¡Tu frecuencia de color está activada!
            </h2>
            <div className="relative inline-block">
              <h3 className={`text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r ${colorGradient.replace('from-', 'from-').replace('to-', 'to-')}`}>
                ELIGE TU NÚMERO SAGRADO
              </h3>
              <Star className="absolute -top-2 -right-6 md:-right-8 w-5 h-5 md:w-6 md:h-6 text-indigo-500" />
            </div>
            <p className="text-gray-600 mt-3 text-sm md:text-base">
              Tu número favorito del 1 al 9 revela la vibración numérica para calcular el código divino*
            </p>
          </div>

          {/* Numbers Grid */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
            {numbers.map((number) => (
              <div
                key={number.value}
                onClick={() => handleNumberSelect(number.value)}
                className={`relative cursor-pointer group transition-all duration-300 transform hover:scale-105 ${
                  selectedNumber === number.value ? 'scale-110' : ''
                }`}
              >
                {/* Number Circle */}
                <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full border-4 ${
                  selectedNumber === number.value 
                    ? `bg-gradient-to-br ${colorGradient} border-white shadow-2xl` 
                    : 'bg-white border-gray-300 shadow-lg hover:border-gray-400'
                } flex items-center justify-center mb-3 relative overflow-hidden ${
                  selectedNumber === number.value ? 'animate-pulse' : ''
                }`}>
                  <span className={`text-2xl md:text-3xl font-black ${
                    selectedNumber === number.value ? 'text-white' : 'text-gray-700'
                  }`}>
                    {number.value}
                  </span>

                  {/* Selection Effect */}
                  {selectedNumber === number.value && (
                    <>
                      <div className="absolute inset-0 bg-white opacity-20 animate-ping"></div>
                      <div className="absolute -inset-1 border-2 border-white rounded-full animate-pulse"></div>
                    </>
                  )}
                </div>

                {/* Number Info */}
                <div className="text-center">
                  <h4 className={`font-bold text-sm md:text-base mb-1 ${
                    selectedNumber === number.value ? 'text-indigo-800' : 'text-gray-800'
                  }`}>
                    {number.energy}
                  </h4>
                  <p className={`text-xs md:text-sm ${
                    selectedNumber === number.value ? 'text-indigo-600' : 'text-gray-600'
                  }`}>
                    {number.meaning}
                  </p>
                </div>

                {/* Selection Ring */}
                {selectedNumber === number.value && (
                  <div className={`absolute -inset-2 rounded-full border-2 border-current animate-ping opacity-75`} 
                       style={{ borderColor: selectedColor === 'yellow' ? '#D97706' : undefined }}></div>
                )}
              </div>
            ))}
          </div>

          {/* Selected Number Feedback */}
          {selectedNumberData && (
            <div className={`bg-gradient-to-r ${colorGradient} rounded-2xl p-6 mb-6 md:mb-8 text-white animate-fade-in`}>
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold mb-2">
                  🔥 ¡Vibración Numérica Detectada! 🔥
                </h3>
                <p className="text-sm md:text-base opacity-90">
                  El número <span className="font-bold text-2xl">{selectedNumberData.value}</span> revela que tu alma vibra como un{' '}
                  <span className="font-bold">{selectedNumberData.energy}</span>, con la energía de{' '}
                  <span className="font-bold">{selectedNumberData.meaning.toLowerCase()}</span>.
                </p>
                <div className="mt-3 bg-white/20 rounded-lg p-3">
                  <p className="text-sm font-medium">
                    ✨ Esta combinación de color + número creará un código divino extremadamente poderoso ✨
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Continue Button */}
          {selectedNumber !== null && (
            <div className="text-center">
              <button
                onClick={handleSubmit}
                className={`bg-gradient-to-r ${colorGradient} hover:opacity-90 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg shadow-lg animate-fade-in`}
              >
                GENERAR MI CÓDIGO DIVINO ÚNICO
              </button>
            </div>
          )}

          {/* Instruction */}
          {selectedNumber === null && (
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Selecciona el número del 1 al 9 que más resuene contigo
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Floating CTA Button */}
      {selectedNumber !== null && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-indigo-200 p-4 shadow-lg z-50">
          <div className="max-w-md mx-auto">
            <button
              onClick={handleSubmit}
              className={`w-full bg-gradient-to-r ${colorGradient} hover:opacity-90 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden`}
            >
              <span className="relative flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-lg">REVELAR MI CÓDIGO AHORA</span>
                <Sparkles className="w-5 h-5" />
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}