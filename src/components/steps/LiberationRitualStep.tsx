import React, { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

interface LiberationRitualStepProps {
  onNext: () => void;
  divineCode: string;
  emotionalAnswer: string; // resposta7 - vulnerabilidade emocional
}

export function LiberationRitualStep({ onNext, divineCode, emotionalAnswer }: LiberationRitualStepProps) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [burningWords, setBurningWords] = useState<string[]>([]);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  // Palavras que serão "queimadas" pela chama
  const wordsToDestroy = [
    emotionalAnswer || 'Frustración',
    'Vergüenza',
    'Retroceso', 
    'Culpa',
    'Falta de dirección'
  ];

  useEffect(() => {
    // Fase 1: Mostrar palavras aparecendo (2 segundos)
    const showWordsTimer = setTimeout(() => {
      setCurrentPhase(1);
    }, 1000);

    // Fase 2: Começar a queimar palavras uma por uma (após 3 segundos)
    const burnTimer = setTimeout(() => {
      setCurrentPhase(2);
      
      // Queimar cada palavra com intervalo de 1 segundo
      wordsToDestroy.forEach((word, index) => {
        setTimeout(() => {
          setBurningWords(prev => [...prev, word]);
        }, index * 1000);
      });
    }, 3000);

    // Fase 3: Mostrar mensagem final (após 8 segundos total)
    const finalMessageTimer = setTimeout(() => {
      setShowFinalMessage(true);
    }, 8000);

    return () => {
      clearTimeout(showWordsTimer);
      clearTimeout(burnTimer);
      clearTimeout(finalMessageTimer);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Efeitos de luz dourada no centro */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute w-64 h-64 bg-gradient-to-r from-yellow-500/30 to-orange-500/30 rounded-full blur-2xl animate-ping"></div>
        <div className="absolute w-32 h-32 bg-gradient-to-r from-yellow-600/40 to-orange-600/40 rounded-full blur-xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        {/* Frase inicial */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-relaxed">
            Has sido fiel, pero también has cargado{' '}
            <span className="text-yellow-400">pesos que no eran tuyos</span>...
          </h1>
        </div>

        {/* Container da Cruz Divina e Palavras */}
        <div className="relative mb-12">
          {/* Cruz Divina Central Iluminada */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              {/* Cruz principal com brilho divino */}
              <div className="w-32 h-40 relative">
                {/* Base luminosa da cruz */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-20 h-10 bg-gradient-to-t from-yellow-500 to-white rounded-full blur-lg opacity-80"></div>
                
                {/* Haste vertical da cruz */}
                <div className="absolute left-1/2 top-0 transform -translate-x-1/2 w-6 h-32 bg-gradient-to-b from-white via-yellow-300 to-yellow-500 rounded-full shadow-2xl"
                     style={{ 
                       boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(251, 191, 36, 0.6), 0 0 90px rgba(251, 191, 36, 0.4)'
                     }}></div>
                
                {/* Haste horizontal da cruz */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-20 h-6 bg-gradient-to-r from-yellow-500 via-yellow-300 to-white rounded-full shadow-2xl"
                     style={{ 
                       boxShadow: '0 0 30px rgba(255, 255, 255, 0.8), 0 0 60px rgba(251, 191, 36, 0.6), 0 0 90px rgba(251, 191, 36, 0.4)'
                     }}></div>

                {/* Brilho interno pulsante */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 bg-white rounded-full animate-pulse opacity-90"></div>
                </div>

                {/* Raios de luz divina */}
                <div className="absolute inset-0">
                  {[...Array(12)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-1 h-12 bg-gradient-to-t from-transparent via-yellow-300 to-transparent animate-pulse"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${30 + i * 2}px)`,
                        animationDelay: `${i * 0.1}s`,
                        opacity: 0.7
                      }}
                    />
                  ))}
                </div>

                {/* Partículas de luz divina */}
                <div className="absolute inset-0">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-white rounded-full animate-bounce"
                      style={{
                        left: `${30 + Math.random() * 40}%`,
                        top: `${20 + Math.random() * 60}%`,
                        animationDelay: `${i * 0.3}s`,
                        animationDuration: `${1.5 + Math.random()}s`
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Aura divina ao redor da cruz */}
              <div className="absolute -inset-8 bg-gradient-to-r from-white/20 to-yellow-300/20 rounded-full blur-2xl animate-pulse"></div>
              <div className="absolute -inset-12 bg-gradient-to-r from-yellow-200/10 to-white/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

          {/* Palavras sendo consumidas */}
          <div className="space-y-4">
            {wordsToDestroy.map((word, index) => {
              const isVisible = currentPhase >= 1;
              const isBurning = burningWords.includes(word);
              
              return (
                <div
                  key={word}
                  className={`transition-all duration-1000 ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                  } ${
                    isBurning ? 'opacity-0 scale-75' : ''
                  }`}
                  style={{ 
                    transitionDelay: `${index * 200}ms`,
                    filter: isBurning ? 'blur(2px)' : 'none'
                  }}
                >
                  <div className={`inline-block px-6 py-3 rounded-lg text-xl font-bold ${
                    isBurning 
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white animate-pulse' 
                      : 'bg-gray-800 text-red-400 border border-red-400'
                  }`}>
                    {word}
                    
                    {/* Efeito de queima */}
                    {isBurning && (
                      <div className="absolute inset-0 bg-gradient-to-t from-orange-600 via-yellow-500 to-transparent opacity-70 rounded-lg animate-pulse"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Mensagem final */}
        {showFinalMessage && (
          <div className="animate-fade-in">
            <div className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 rounded-2xl p-8 mb-8 border-2 border-green-400 backdrop-blur-sm">
              <h2 className="text-2xl md:text-3xl font-bold text-green-400 mb-4">
                Tus bloqueos fueron expuestos.
              </h2>
              <h3 className="text-xl md:text-2xl font-bold text-white">
                Estás listo para activar tu código.
              </h3>
            </div>

            {/* Botão CTA */}
            <div className="relative">
              {/* Anéis de poder */}
              <div className="absolute -inset-4 rounded-2xl bg-gradient-to-r from-red-500 to-orange-500 opacity-30 animate-ping"></div>
              <div className="absolute -inset-6 rounded-2xl bg-gradient-to-r from-yellow-400 to-red-400 opacity-20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              
              <button
                onClick={onNext}
                className="relative bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 hover:from-red-700 hover:via-orange-600 hover:to-yellow-600 text-white font-black py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 text-xl shadow-2xl"
                style={{
                  boxShadow: '0 20px 40px rgba(239, 68, 68, 0.4), 0 0 30px rgba(245, 158, 11, 0.3)'
                }}
              >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full animate-pulse rounded-2xl"></div>
                
                <span className="relative flex items-center justify-center space-x-3">
                  <span className="text-white text-2xl">✝️</span>
                  <span className="tracking-wide">ROMPER EL TECHO INVISIBLE</span>
                  <Sparkles className="w-6 h-6 animate-spin" />
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Indicador de progresso */}
        {!showFinalMessage && (
          <div className="mt-8">
            <div className="flex justify-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full transition-all duration-500 ${
                    i <= currentPhase ? 'bg-yellow-400 scale-110' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            <p className="text-white/80 text-sm mt-4">
              Liberando tu energía espiritual...
            </p>
          </div>
        )}
      </div>

      {/* Partículas flutuantes de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-400 rounded-full animate-bounce opacity-60"
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