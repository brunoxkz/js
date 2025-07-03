import React, { useState, useEffect } from 'react';
import { Palette, Sparkles, CheckCircle } from 'lucide-react';

interface ColorSelectionStepProps {
  onNext: () => void;
  onUpdateColor: (color: string) => void;
}

export function ColorSelectionStep({ onNext, onUpdateColor }: ColorSelectionStepProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [showFullScreenMessage, setShowFullScreenMessage] = useState(false);

  const colors = [
    { id: 'red', name: 'Rojo Pasión', value: '#DC2626', gradient: 'from-red-500 to-red-600', meaning: 'Fuerza y Determinación' },
    { id: 'blue', name: 'Azul Divino', value: '#2563EB', gradient: 'from-blue-500 to-blue-600', meaning: 'Sabiduría y Paz' },
    { id: 'green', name: 'Verde Prosperidad', value: '#059669', gradient: 'from-green-500 to-green-600', meaning: 'Abundancia y Crecimiento' },
    { id: 'yellow', name: 'Dorado Celestial', value: '#D97706', gradient: 'from-yellow-500 to-orange-500', meaning: 'Iluminación y Alegría' },
    { id: 'purple', name: 'Púrpura Real', value: '#7C3AED', gradient: 'from-purple-500 to-purple-600', meaning: 'Realeza y Espiritualidad' },
    { id: 'pink', name: 'Rosa Amor', value: '#DB2777', gradient: 'from-pink-500 to-pink-600', meaning: 'Amor y Compasión' },
    { id: 'orange', name: 'Naranja Energía', value: '#EA580C', gradient: 'from-orange-500 to-orange-600', meaning: 'Creatividad y Entusiasmo' },
    { id: 'teal', name: 'Turquesa Sanación', value: '#0D9488', gradient: 'from-teal-500 to-teal-600', meaning: 'Sanación y Equilibrio' }
  ];

  const handleColorSelect = (color: typeof colors[0]) => {
    setSelectedColor(color.id);
    onUpdateColor(color.id);
    
    // Mostrar mensagem em tela cheia imediatamente
    setShowFullScreenMessage(true);
    
    // Redirecionar automaticamente após 3 segundos
    setTimeout(() => {
      onNext();
    }, 3000);
  };

  const selectedColorData = colors.find(c => c.id === selectedColor);

  // Tela cheia com mensagem
  if (showFullScreenMessage && selectedColorData) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${selectedColorData.gradient} flex items-center justify-center px-4 relative overflow-hidden`}>
        {/* Efeitos de luz de fundo */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-white/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-white/15 rounded-full blur-xl animate-ping"></div>
        </div>

        <div className="max-w-2xl w-full text-center relative z-10">
          {/* Ícone de confirmação gigante */}
          <div className="mb-8">
            <div className="relative w-32 h-32 mx-auto">
              {/* Anéis de confirmação */}
              <div className="absolute -inset-8 border-4 border-white/30 rounded-full animate-ping"></div>
              <div className="absolute -inset-12 border-4 border-white/20 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
              <div className="absolute -inset-16 border-4 border-white/10 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
              
              {/* Ícone central */}
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
                <CheckCircle className="w-16 h-16 text-green-500" />
              </div>
            </div>
          </div>

          {/* Mensagem principal */}
          <div className="text-white mb-8">
            <h1 className="text-4xl md:text-5xl font-black mb-6 animate-fade-in">
              ¡FRECUENCIA ACTIVADA!
            </h1>
            
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-8 mb-6 border-2 border-white/30">
              <h2 className="text-2xl md:text-3xl font-bold mb-4">
                Tu alma vibra con {selectedColorData.name}
              </h2>
              <p className="text-xl md:text-2xl opacity-90 mb-4">
                Energía de <span className="font-bold">{selectedColorData.meaning}</span>
              </p>
              <div className="bg-white/30 rounded-xl p-4">
                <p className="text-lg font-medium">
                  ✨ Esta frecuencia potenciará significativamente tu código divino ✨
                </p>
              </div>
            </div>

            <div className="text-lg opacity-80">
              Preparando tu experiencia personalizada...
            </div>
          </div>

          {/* Indicador de progresso */}
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-white rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>

        {/* Partículas flutuantes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-white rounded-full animate-bounce opacity-60"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 flex items-center justify-center px-4 pb-24">
      <div className="max-w-4xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-purple-200">
          {/* Header */}
          <div className="text-center mb-6 md:mb-8">
            <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Palette className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
              ¡Tu energía espiritual está resonando!
            </h2>
            <div className="relative inline-block">
              <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                ELIGE TU COLOR DIVINO
              </h3>
              <Sparkles className="absolute -top-2 -right-6 md:-right-8 w-5 h-5 md:w-6 md:h-6 text-purple-500" />
            </div>
            <p className="text-gray-600 mt-3 text-sm md:text-base">
              Tu alma está conectada a una frecuencia de color específica que amplificará tu código divino
            </p>
          </div>

          {/* Color Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {colors.map((color) => (
              <div
                key={color.id}
                onClick={() => handleColorSelect(color)}
                className="relative cursor-pointer group transition-all duration-300 transform hover:scale-105"
              >
                {/* Color Circle */}
                <div className={`w-20 h-20 md:w-24 md:h-24 mx-auto rounded-full bg-gradient-to-br ${color.gradient} shadow-lg mb-3 relative overflow-hidden hover:shadow-2xl transition-all duration-300`}>
                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
                  
                  {/* Brilho de seleção */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
                </div>

                {/* Color Info */}
                <div className="text-center">
                  <h4 className="font-bold text-sm md:text-base mb-1 text-gray-800 group-hover:text-purple-800 transition-colors">
                    {color.name}
                  </h4>
                  <p className="text-xs md:text-sm text-gray-600 group-hover:text-purple-600 transition-colors">
                    {color.meaning}
                  </p>
                </div>

                {/* Hover Ring */}
                <div className="absolute -inset-2 rounded-full border-2 border-purple-400 opacity-0 group-hover:opacity-50 group-hover:animate-ping transition-opacity duration-300"></div>
              </div>
            ))}
          </div>

          {/* Instruction */}
          <div className="text-center">
            <p className="text-sm text-gray-500">
              Selecciona el color que más resuene con tu espíritu
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}