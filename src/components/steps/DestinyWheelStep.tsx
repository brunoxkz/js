import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Target, Zap, Crown, Star } from 'lucide-react';

interface DestinyWheelStepProps {
  onNext: () => void;
  birthDay: string;
  birthMonth: string;
}

export function DestinyWheelStep({ onNext, birthDay, birthMonth }: DestinyWheelStepProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [spinCount, setSpinCount] = useState(0);
  const [results, setResults] = useState<number[]>([]);
  const [alignmentResult, setAlignmentResult] = useState<string>('');
  const [usedNumbers, setUsedNumbers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [hasSpunOnce, setHasSpunOnce] = useState(false); // NOVO: controla se já girou uma vez
  const wheelRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>();

  const numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
  
  const targetDay = parseInt(birthDay);
  const targetMonth = parseInt(birthMonth);

  const getRandomAvailableNumber = () => {
    const availableNumbers = numbers.filter(num => !usedNumbers.includes(num));
    
    if (availableNumbers.length === 0) {
      setUsedNumbers([]);
      return Math.floor(Math.random() * 12) + 1;
    }
    
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    return availableNumbers[randomIndex];
  };

  const spinWheel = () => {
    if (isSpinning || spinCount >= 2) return;

    setIsSpinning(true);
    setHasSpunOnce(true); // MARCA que já girou pelo menos uma vez
    
    let targetNumber: number;
    
    if (spinCount === 0) {
      // PRIMEIRA tentativa - SEMPRE dia de nascimento
      targetNumber = targetDay;
    } else if (spinCount === 1) {
      // SEGUNDA tentativa - SEMPRE mês de nascimento
      targetNumber = targetMonth;
    } else {
      // TERCEIRA+ tentativas - NÚMEROS COMPLETAMENTE ALEATÓRIOS
      targetNumber = getRandomAvailableNumber();
    }

    if (spinCount >= 2) {
      setUsedNumbers(prev => [...prev, targetNumber]);
    }

    // Calcular onde o número está na roda (em graus)
    const degreesPerSegment = 360 / 12;
    const targetAngle = (targetNumber - 1) * degreesPerSegment;
    
    // Adicionar voltas extras para efeito visual (5-8 voltas completas)
    const extraSpins = 5 + Math.random() * 3;
    const totalRotation = currentRotation + (extraSpins * 360) + (360 - targetAngle);

    // Animação suave com desaceleração
    animateWheel(currentRotation, totalRotation, 3000, targetNumber);
  };

  const animateWheel = (startRotation: number, endRotation: number, duration: number, targetNumber: number) => {
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Função de easing para desaceleração suave (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      
      const currentRotation = startRotation + (endRotation - startRotation) * easeOut;
      
      if (wheelRef.current) {
        wheelRef.current.style.transform = `rotate(${currentRotation}deg)`;
      }
      
      setCurrentRotation(currentRotation);
      
      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Animação concluída
        setIsSpinning(false);
        setResults(prev => [...prev, targetNumber]);
        setSpinCount(prev => prev + 1);

        // Verificar se completou o alinhamento
        if (spinCount === 0) {
          setAlignmentResult(`${targetNumber}`);
          setShowResult(true);
        } else if (spinCount === 1) {
          setAlignmentResult(`${results[0]}-${targetNumber}`);
          setShowResult(true);
        }
      }
    };
    
    animate();
  };

  const acceptAlignment = () => {
    onNext();
  };

  // Cleanup animation on unmount
  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900 flex items-center justify-center px-4 pb-32 relative overflow-hidden">
      {/* Efeitos de luz celestial */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-400/10 rounded-full blur-xl animate-ping"></div>
      </div>

      <div className="max-w-2xl w-full relative z-10">
        <div className="bg-white/10 backdrop-blur-sm rounded-3xl shadow-2xl p-6 md:p-8 border-2 border-white/20">
          {/* Header - OCULTAR APÓS PRIMEIRO GIRO */}
          {!hasSpunOnce && (
            <div className="text-center mb-6 md:mb-8">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
                <Crown className="w-8 h-8 md:w-10 md:h-10 text-white" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                ¡La Rueda del Destino Sagrada!
              </h2>
              <div className="relative inline-block">
                <h3 className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-400">
                  PRUEBA TU ALINEACIÓN DIVINA
                </h3>
                <Star className="absolute -top-2 -right-6 md:-right-8 w-5 h-5 md:w-6 md:h-6 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-white/80 mt-3 text-sm md:text-base">
                La rueda está hecha para testar tu alineamiento con el propósito
              </p>
            </div>
          )}

          {/* RESULTADO ACIMA DA RODA - SEMPRE VISÍVEL QUANDO EXISTE */}
          {showResult && alignmentResult && !isSpinning && (
            <div className="bg-gradient-to-r from-green-900/80 to-emerald-900/80 rounded-2xl p-6 mb-6 border-2 border-green-400 animate-fade-in backdrop-blur-sm">
              <div className="text-center">
                <h3 className="text-lg md:text-xl font-bold text-green-400 mb-2">
                  ✨ Alineación Destino ✨
                </h3>
                <p className="text-green-300 font-bold text-2xl tracking-wider mb-3">
                  {alignmentResult}
                </p>
                {spinCount >= 2 && (
                  <div className="bg-green-800/50 rounded-lg p-3">
                    <p className="text-green-200 text-sm font-medium">
                      🌟 Puede ser tu día de suerte - estos 2 números son marcantes y están escritos en tu línea del tiempo, esto es un buen señal 🌟
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Wheel Container */}
          <div className="relative mb-8">
            <div className="flex justify-center">
              <div className="relative">
                {/* Outer Sacred Ring */}
                <div className="absolute -inset-8 rounded-full border-4 border-yellow-400/30 animate-pulse"></div>
                <div className="absolute -inset-12 rounded-full border-2 border-purple-400/20 animate-ping"></div>
                
                {/* Wheel */}
                <div
                  ref={wheelRef}
                  className={`w-80 h-80 md:w-96 md:h-96 rounded-full border-8 border-yellow-400 shadow-2xl relative ${
                    isSpinning ? 'shadow-yellow-400/50' : ''
                  }`}
                  style={{
                    background: `conic-gradient(
                      from 0deg,
                      #1e40af 0deg 30deg,
                      #7c3aed 30deg 60deg,
                      #dc2626 60deg 90deg,
                      #059669 90deg 120deg,
                      #ea580c 120deg 150deg,
                      #0891b2 150deg 180deg,
                      #be185d 180deg 210deg,
                      #4338ca 210deg 240deg,
                      #b91c1c 240deg 270deg,
                      #047857 270deg 300deg,
                      #c2410c 300deg 330deg,
                      #0e7490 330deg 360deg
                    )`,
                    transformOrigin: 'center center'
                  }}
                >
                  {/* Sacred Symbols */}
                  {numbers.map((_, index) => {
                    const angle = index * 30;
                    return (
                      <div
                        key={index}
                        className="absolute w-0.5 h-full bg-white/50 origin-bottom"
                        style={{
                          left: '50%',
                          top: '0',
                          transform: `translateX(-50%) rotate(${angle}deg)`,
                          transformOrigin: 'center bottom'
                        }}
                      />
                    );
                  })}

                  {/* Numbers with Sacred Design */}
                  {numbers.map((number, index) => {
                    const angle = index * 30 + 15;
                    const radius = 130;
                    const x = Math.cos((angle - 90) * Math.PI / 180) * radius;
                    const y = Math.sin((angle - 90) * Math.PI / 180) * radius;
                    
                    return (
                      <div
                        key={number}
                        className="absolute w-12 h-12 flex items-center justify-center text-white font-black text-xl bg-black/60 rounded-full border-2 border-yellow-400/80 shadow-lg backdrop-blur-sm"
                        style={{
                          left: `calc(50% + ${x}px - 24px)`,
                          top: `calc(50% + ${y}px - 24px)`,
                        }}
                      >
                        {number}
                      </div>
                    );
                  })}
                  
                  {/* Sacred Center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white ${
                      isSpinning ? 'animate-pulse' : ''
                    }`}>
                      <Crown className="w-8 h-8 text-white" />
                    </div>
                  </div>

                  {/* Divine Energy Overlay */}
                  {isSpinning && (
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-spin"></div>
                  )}
                </div>

                {/* Sacred Pointer */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-4 z-10">
                  <div className="relative">
                    <div className="w-0 h-0 border-l-[24px] border-r-[24px] border-b-[48px] border-l-transparent border-r-transparent border-b-yellow-500 drop-shadow-2xl"></div>
                    <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[16px] border-r-[16px] border-b-[32px] border-l-transparent border-r-transparent border-b-yellow-400"></div>
                    <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>

                {/* Divine Aura */}
                {isSpinning && (
                  <div className="absolute -inset-12 rounded-full border-4 border-dashed border-yellow-400 animate-spin opacity-50"></div>
                )}
              </div>
            </div>
          </div>

          {/* BOTÃO DE GIRO SAGRADO - APENAS 2 TENTATIVAS */}
          <div className="flex justify-center mb-8">
            {spinCount < 2 && (
              <div className="relative">
                {/* Anéis Sagrados */}
                <div className="absolute -inset-6 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 opacity-20 animate-ping"></div>
                <div className="absolute -inset-8 rounded-full bg-gradient-to-r from-purple-400 to-blue-400 opacity-15 animate-ping" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute -inset-10 rounded-full bg-gradient-to-r from-white to-yellow-200 opacity-10 animate-ping" style={{ animationDelay: '1s' }}></div>
                
                {/* Partículas Sagradas */}
                <div className="absolute inset-0 overflow-visible">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-2 h-2 bg-yellow-400 rounded-full animate-bounce"
                      style={{
                        top: '50%',
                        left: '50%',
                        transform: `translate(-50%, -50%) rotate(${i * 45}deg) translateY(-${40 + i * 5}px)`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>

                <button
                  onClick={spinWheel}
                  disabled={isSpinning}
                  className={`relative bg-gradient-to-r from-yellow-500 via-orange-500 to-yellow-500 hover:from-yellow-600 hover:via-orange-600 hover:to-yellow-600 disabled:opacity-50 text-white font-black py-6 px-12 rounded-full transition-all duration-300 transform hover:scale-110 text-xl shadow-2xl ${
                    isSpinning ? 'animate-pulse cursor-not-allowed' : 'hover:shadow-yellow-500/50'
                  }`}
                  style={{
                    boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4), 0 0 30px rgba(251, 146, 60, 0.3), 0 0 60px rgba(252, 211, 77, 0.2)',
                    background: isSpinning 
                      ? 'linear-gradient(45deg, #f59e0b, #ea580c, #f59e0b, #ea580c)' 
                      : 'linear-gradient(45deg, #f59e0b, #ea580c, #f59e0b)',
                    backgroundSize: '300% 300%',
                    animation: isSpinning ? 'gradient-shift 1s ease-in-out infinite' : 'gradient-shift 3s ease-in-out infinite'
                  }}
                >
                  {/* Shimmer Sagrado */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent transform -skew-x-12 -translate-x-full animate-pulse rounded-full"></div>
                  
                  {/* Sparkles Internos */}
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute top-2 left-4 w-2 h-2 bg-white/80 rounded-full animate-bounce"></div>
                    <div className="absolute top-4 right-6 w-1 h-1 bg-white/90 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
                    <div className="absolute bottom-3 left-8 w-1.5 h-1.5 bg-white/70 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
                    <div className="absolute bottom-2 right-4 w-1 h-1 bg-white/80 rounded-full animate-bounce" style={{ animationDelay: '0.9s' }}></div>
                  </div>

                  {isSpinning ? (
                    <span className="relative flex items-center justify-center space-x-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span className="tracking-wider">GIRANDO...</span>
                      <Zap className="w-6 h-6 animate-bounce" />
                    </span>
                  ) : (
                    <span className="relative flex items-center justify-center space-x-3">
                      <Crown className="w-6 h-6 animate-pulse" />
                      <span className="tracking-wider">
                        {spinCount === 0 && "GIRAR DESTINO"}
                        {spinCount === 1 && "SEGUNDA OPORTUNIDAD"}
                      </span>
                      <Star className="w-6 h-6 animate-pulse" />
                    </span>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Spinning Status */}
          {isSpinning && (
            <div className="text-center mb-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 border-2 border-white/30 animate-pulse">
                <h3 className="text-lg font-bold text-white mb-2">
                  🌟 ¡La Rueda Sagrada Está Girando! 🌟
                </h3>
                <p className="text-white/80">
                  Las fuerzas divinas están alineándose para revelar tu destino...
                </p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="text-center space-y-4">
            {showResult && spinCount >= 2 && !isSpinning && (
              <button
                onClick={acceptAlignment}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 text-lg shadow-lg hover:shadow-2xl"
              >
                <span className="flex items-center justify-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>✨ APROVECHAR ESTE ALINEAMIENTO</span>
                </span>
              </button>
            )}
          </div>

          {/* Instructions */}
          <div className="mt-6 text-center">
            <p className="text-sm text-white/60">
              {spinCount === 0 && "🎯 La rueda revelará tu primer número sagrado"}
              {spinCount === 1 && "🌙 Ahora la rueda revelará tu segundo número"}
              {spinCount >= 2 && "🔮 ¡Alineamiento completo revelado!"}
            </p>
          </div>
        </div>
      </div>

      {/* Floating CTA Button */}
      {showResult && spinCount >= 2 && !isSpinning && (
        <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-green-200 p-4 shadow-lg z-50">
          <div className="max-w-md mx-auto">
            <button
              onClick={acceptAlignment}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
            >
              <span className="flex items-center justify-center space-x-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-lg">🌟 CONTINUAR CON MI DESTINO</span>
              </span>
            </button>
          </div>
        </div>
      )}

      {/* CSS para animação do gradiente */}
      <style jsx>{`
        @keyframes gradient-shift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
}