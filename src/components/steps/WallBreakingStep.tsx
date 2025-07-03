import React, { useState, useEffect } from 'react';
import { Zap, Sparkles } from 'lucide-react';

interface WallBreakingStepProps {
  onNext: () => void;
  divineCode: string;
}

export function WallBreakingStep({ onNext, divineCode }: WallBreakingStepProps) {
  const [clickCount, setClickCount] = useState(0);
  const [cracks, setCracks] = useState<Array<{ id: number; x: number; y: number; rotation: number }>>([]);
  const [isExploded, setIsExploded] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);

  const handleWallClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (clickCount >= 3 || isExploded) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Adicionar rachadura na posição clicada
    const newCrack = {
      id: Date.now(),
      x,
      y,
      rotation: Math.random() * 360
    };

    setCracks(prev => [...prev, newCrack]);
    setClickCount(prev => prev + 1);

    // No terceiro clique, explodir a parede
    if (clickCount === 2) {
      setTimeout(() => {
        setIsExploded(true);
        setTimeout(() => {
          setShowFinalMessage(true);
          // REDIRECIONAMENTO AUTOMÁTICO APÓS 3 SEGUNDOS
          setTimeout(() => {
            onNext();
          }, 3000);
        }, 1000);
      }, 500);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black flex items-center justify-center px-4 relative overflow-hidden">
      {/* Efeitos de luz de fundo */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="max-w-4xl w-full text-center relative z-10">
        {!isExploded && !showFinalMessage && (
          <>
            {/* Instrução ACIMA da animação */}
            <div className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
                Haz clic para romper el{' '}
                <span className="text-red-400">'Techo Invisible'</span>{' '}
                que ha limitado tu vida...
              </h1>
              <p className="text-gray-300 text-lg">
                Cliques restantes: <span className="text-yellow-400 font-bold">{3 - clickCount}</span>
              </p>
            </div>

            {/* Parede/Muralha */}
            <div className="flex justify-center mb-8">
              <div
                onClick={handleWallClick}
                className="relative cursor-pointer group transition-all duration-300 hover:scale-105"
              >
                {/* Parede principal */}
                <div className={`w-80 h-60 md:w-96 md:h-72 bg-gradient-to-b from-gray-600 to-gray-800 rounded-lg shadow-2xl border-4 border-gray-500 relative overflow-hidden ${
                  clickCount > 0 ? 'animate-pulse' : ''
                }`}>
                  {/* Textura da parede */}
                  <div className="absolute inset-0 opacity-30">
                    <div className="w-full h-full bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800"></div>
                    {/* Linhas de tijolo */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-full h-0.5 bg-gray-500"
                        style={{ top: `${(i + 1) * 12.5}%` }}
                      />
                    ))}
                    {/* Linhas verticais */}
                    {[...Array(6)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute w-0.5 h-full bg-gray-500"
                        style={{ left: `${(i + 1) * 16.66}%` }}
                      />
                    ))}
                  </div>

                  {/* Texto na parede */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <h3 className="text-xl md:text-2xl font-bold text-red-400 mb-2">
                        TECHO INVISIBLE
                      </h3>
                      <p className="text-gray-300 text-sm">
                        Código {divineCode}
                      </p>
                    </div>
                  </div>

                  {/* Rachaduras */}
                  {cracks.map((crack) => (
                    <div
                      key={crack.id}
                      className="absolute pointer-events-none"
                      style={{
                        left: `${crack.x}%`,
                        top: `${crack.y}%`,
                        transform: `translate(-50%, -50%) rotate(${crack.rotation}deg)`
                      }}
                    >
                      {/* Rachadura principal */}
                      <div className="w-24 h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-pulse"></div>
                      <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent absolute top-0 left-1/2 transform -translate-x-1/2"></div>
                      
                      {/* Rachaduras secundárias */}
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2">
                        <div className="w-8 h-0.5 bg-yellow-300 rotate-45 animate-pulse"></div>
                        <div className="w-6 h-0.5 bg-yellow-300 -rotate-45 animate-pulse"></div>
                      </div>

                      {/* Brilho da rachadura */}
                      <div className="absolute inset-0 bg-yellow-400/30 blur-sm animate-pulse"></div>
                    </div>
                  ))}

                  {/* Efeito de hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Indicador de clique */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className={`w-16 h-16 border-4 border-yellow-400 rounded-full animate-ping ${
                      clickCount === 0 ? 'opacity-50' : 'opacity-0'
                    }`}></div>
                  </div>
                </div>

                {/* Aura de poder ao redor */}
                {clickCount > 0 && (
                  <div className="absolute -inset-4 bg-gradient-to-r from-yellow-400/20 to-red-400/20 rounded-lg blur-xl animate-pulse"></div>
                )}
              </div>
            </div>

            {/* Feedback dos cliques */}
            {clickCount > 0 && (
              <div className="mb-6">
                <div className="bg-gradient-to-r from-yellow-900/50 to-orange-900/50 rounded-xl p-4 border border-yellow-400">
                  <p className="text-yellow-400 font-bold">
                    {clickCount === 1 && "¡Primera grieta! El techo se está debilitando..."}
                    {clickCount === 2 && "¡Más grietas! El techo está a punto de colapsar..."}
                    {clickCount === 3 && "¡El techo está completamente fracturado!"}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {/* Explosão */}
        {isExploded && !showFinalMessage && (
          <div className="animate-fade-in">
            <div className="relative">
              {/* Efeito de explosão */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-96 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 rounded-full animate-ping opacity-50"></div>
                <div className="absolute w-64 h-64 bg-gradient-to-r from-white via-yellow-300 to-orange-400 rounded-full animate-pulse"></div>
              </div>

              {/* Partículas de explosão */}
              <div className="relative">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                    style={{
                      left: `${50 + (Math.random() - 0.5) * 100}%`,
                      top: `${50 + (Math.random() - 0.5) * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  />
                ))}
              </div>

              <h2 className="text-4xl md:text-5xl font-black text-white mb-4 animate-pulse">
                💥 ¡TECHO ROTO! 💥
              </h2>
            </div>
          </div>
        )}

        {/* Mensagem final */}
        {showFinalMessage && (
          <div className="animate-fade-in">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-white text-3xl">👑</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-green-400 mb-4">
                ¡Techo Invisible ROTO!
              </h1>
              
              <div className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 rounded-2xl p-6 mb-8 border-2 border-green-400">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-2">
                  Tu nueva vida comienza ahora.
                </h2>
                <p className="text-green-300">
                  Tu Código {divineCode} está libre para manifestar su máximo potencial
                </p>
              </div>

              <p className="text-white/80 text-lg">
                Redirigiendo automáticamente a tu plan divino...
              </p>
            </div>

            {/* Indicador de progresso */}
            <div className="flex justify-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        )}

        {/* Progresso visual */}
        {!showFinalMessage && (
          <div className="mt-8">
            <div className="flex justify-center space-x-2 mb-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    i < clickCount ? 'bg-yellow-400 scale-110' : 'bg-gray-600'
                  }`}
                />
              ))}
            </div>
            {!isExploded && (
              <p className="text-gray-400 text-sm">
                Haz clic en la pared para crear más grietas
              </p>
            )}
          </div>
        )}
      </div>

      {/* Partículas de fundo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-blue-400 rounded-full animate-bounce opacity-40"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* BOTÃO FLUTUANTE MENOR E MAIS CHAMATIVO - ESTILO KNOCK SOCO */}
      {!isExploded && !showFinalMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50">
          <div className="relative">
            {/* Anéis dourados pulsantes menores */}
            <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 opacity-30 animate-ping"></div>
            <div className="absolute -inset-5 rounded-full bg-gradient-to-r from-yellow-300 to-orange-300 opacity-20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
            
            <button
              onClick={handleWallClick}
              className="bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 hover:from-yellow-600 hover:via-orange-600 hover:to-yellow-600 text-white font-black py-3 px-6 rounded-full transition-all duration-200 transform hover:scale-110 active:scale-95 text-base shadow-2xl"
              style={{
                boxShadow: '0 10px 25px rgba(245, 158, 11, 0.6), 0 0 20px rgba(251, 146, 60, 0.5), 0 0 40px rgba(252, 211, 77, 0.3)',
                animation: 'knock-pulse 1s ease-in-out infinite'
              }}
            >
              <span className="flex items-center justify-center space-x-2">
                <Zap className="w-4 h-4 animate-bounce" />
                <span className="tracking-wide">ROMPER TECHO</span>
                <Sparkles className="w-4 h-4 animate-spin" />
              </span>
            </button>
          </div>
        </div>
      )}

      {/* CSS para animação knock soco */}
      <style jsx>{`
        @keyframes knock-pulse {
          0%, 100% { 
            transform: scale(1);
            box-shadow: 0 10px 25px rgba(245, 158, 11, 0.6), 0 0 20px rgba(251, 146, 60, 0.5), 0 0 40px rgba(252, 211, 77, 0.3);
          }
          50% { 
            transform: scale(1.05);
            box-shadow: 0 15px 35px rgba(245, 158, 11, 0.8), 0 0 30px rgba(251, 146, 60, 0.7), 0 0 60px rgba(252, 211, 77, 0.5);
          }
        }
      `}</style>
    </div>
  );
}