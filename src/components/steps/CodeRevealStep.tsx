import React, { useState, useEffect } from 'react';
import { Crown, Sparkles, Star } from 'lucide-react';
import { getCodeMeaning } from '../../utils/divineCode';

interface CodeRevealStepProps {
  divineCode: string;
  onNext: () => void;
}

export function CodeRevealStep({ divineCode, onNext }: CodeRevealStepProps) {
  const [visibleDigits, setVisibleDigits] = useState<boolean[]>([false, false, false]);
  const codeMeaning = getCodeMeaning(divineCode);
  const codeDigits = divineCode.split('-');

  useEffect(() => {
    // Anima os dígitos aparecendo um por vez
    const timers = [
      setTimeout(() => setVisibleDigits(prev => [true, prev[1], prev[2]]), 500),
      setTimeout(() => setVisibleDigits(prev => [prev[0], true, prev[2]]), 1000),
      setTimeout(() => setVisibleDigits(prev => [prev[0], prev[1], true]), 1500)
    ];

    return () => timers.forEach(timer => clearTimeout(timer));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 flex items-center justify-center px-4 pb-24">
      <div className="max-w-2xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-yellow-300 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-4 left-4">
              <Star className="w-6 h-6 md:w-8 md:h-8 text-yellow-600" />
            </div>
            <div className="absolute top-12 right-8">
              <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-yellow-600" />
            </div>
            <div className="absolute bottom-8 left-12">
              <Crown className="w-8 h-8 md:w-10 md:h-10 text-yellow-600" />
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Header */}
            <div className="mb-6 md:mb-8">
              <Crown className="w-12 h-12 md:w-16 md:h-16 text-yellow-600 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                ¡Tu código ha sido revelado!
              </h2>
            </div>

            {/* Code Display */}
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 shadow-lg">
              <h3 className="text-white text-lg font-semibold mb-4">
                Tu Código Divino de Prosperidad es:
              </h3>
              <div className="text-4xl md:text-6xl font-black text-white tracking-wider mb-4 font-mono">
                {codeDigits.map((digit, index) => (
                  <span key={index} className="inline-block">
                    <span 
                      className={`transition-all duration-500 ${
                        visibleDigits[index] 
                          ? 'opacity-100 transform scale-100' 
                          : 'opacity-0 transform scale-50'
                      }`}
                    >
                      {digit}
                    </span>
                    {index < codeDigits.length - 1 && (
                      <span className="mx-2 opacity-60">-</span>
                    )}
                  </span>
                ))}
              </div>
              <div className="text-white/90 text-base md:text-lg font-medium">
                "{codeMeaning}"
              </div>
            </div>

            {/* Rarity - ATUALIZADO PARA 0,2% */}
            <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 md:p-6 mb-6 md:mb-8 border border-purple-200">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
                <h4 className="text-lg md:text-xl font-bold text-purple-800">
                  CÓDIGO EXTREMADAMENTE RARO
                </h4>
                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-purple-600" />
              </div>
              <p className="text-purple-700 text-base md:text-lg">
                Solo el <span className="font-bold text-xl md:text-2xl">0,2%</span> de las personas reciben este código específico
              </p>
              <p className="text-purple-600 mt-2 text-sm md:text-base">
                que está vinculado a un potencial extraordinario de prosperidad, 
                pero también a un <span className="font-semibold">'techo invisible'</span> único.
              </p>
            </div>

            {/* CTA - FOCO NO PLANO DE ABUNDÂNCIA */}
            <button
              onClick={onNext}
              className="group bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white text-lg md:text-xl font-bold py-4 px-6 md:px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center space-x-2">
                <span>CREAR MI PLAN DE ABUNDANCIA PERSONALIZADO</span>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
                </div>
              </span>
            </button>

            <p className="text-gray-600 text-sm mt-4">
              Continuemos para crear tu plan divino de 7 días específico para tu código {divineCode}
            </p>
          </div>
        </div>
      </div>

      {/* Floating CTA Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-yellow-200 p-4 shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <button
            onClick={onNext}
            className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 relative overflow-hidden"
          >
            <span className="relative flex items-center justify-center space-x-2">
              <Sparkles className="w-5 h-5" />
              <span className="text-lg">CREAR MI PLAN AHORA</span>
              <Sparkles className="w-5 h-5" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}