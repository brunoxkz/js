import React, { useState, useEffect, useRef } from 'react';
import { Check, Clock, Gift, Shield, Star, Users, Zap, ArrowRight, Crown, Target, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { HiddenArchitectureEngine } from '../../utils/hiddenArchitecture';
import { DiagnosisType } from '../../types';
import { useAnalytics } from '../../hooks/useAnalytics';

interface OfferStepProps {
  divineCode: string;
  userName?: string;
}

export function OfferStep({ divineCode, userName = 'Amigo' }: OfferStepProps) {
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 MINUTOS em segundos
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showPersonalMessage, setShowPersonalMessage] = useState(true);
  const [hasGeneratedAudio, setHasGeneratedAudio] = useState(false);
  const [availableSpots, setAvailableSpots] = useState(23); // Começar com 23 vagas
  const [buttonClicks, setButtonClicks] = useState(0);
  const [ctaInteractions, setCTAInteractions] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { trackStepEntry, trackConversion } = useAnalytics();

  useEffect(() => {
    // Track entry to offer page
    trackStepEntry('offer', { divineCode, userName });

    const timer = setInterval(() => {
      setTimeLeft(prev => Math.max(0, prev - 1));
    }, 1000);

    // Gerar áudio personalizado automaticamente APENAS UMA VEZ
    if (!hasGeneratedAudio && userName && userName !== 'Amigo') {
      setTimeout(() => {
        generatePersonalizedAudio();
        setHasGeneratedAudio(true);
      }, 2000);
    }

    // Diminuir vagas a cada 30 segundos
    const spotsTimer = setInterval(() => {
      setAvailableSpots(prev => Math.max(1, prev - 1));
    }, 30000);

    // Track Facebook Pixel events
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'ViewContent', {
        content_name: 'Divine Activation Plan',
        content_category: 'Spiritual Product',
        value: 9.00,
        currency: 'USD',
        divine_code: divineCode
      });
    }

    return () => {
      clearInterval(timer);
      clearInterval(spotsTimer);
    };
  }, [hasGeneratedAudio, userName, divineCode, trackStepEntry]);

  // Generate personalized offer using Hidden Architecture
  const psychProfile = {
    urgencyLevel: 85,
    dominantPain: 'prayer-ceiling',
    emotionalTriggers: ['shame_relief', 'provider_identity', 'spiritual_validation']
  };

  const personalizedOffer = HiddenArchitectureEngine.generatePersonalizedOffer(
    divineCode,
    'financial-ceiling' as DiagnosisType,
    psychProfile
  );

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const generatePersonalizedAudio = async () => {
    setIsGeneratingAudio(true);
    
    try {
      const message = `${userName}... Has llegado al final de una etapa. Tu código ha sido revelado, tu bloqueo expuesto. Este plan no es una opción: Es una instrucción divina para tu liberación. Hazlo por ti, por tu familia, y por tu propósito. ${userName}.`;

      const ELEVEN_LABS_API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;
      const VOICE_ID = 'pNInz6obpgDQGcFmaJgB';
      
      if (!ELEVEN_LABS_API_KEY) {
        console.warn('Eleven Labs API key não configurada');
        return generateBrowserAudio(message);
      }

      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`, {
        method: 'POST',
        headers: {
          'Accept': 'audio/mpeg',
          'Content-Type': 'application/json',
          'xi-api-key': ELEVEN_LABS_API_KEY
        },
        body: JSON.stringify({
          text: message,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.6,
            similarity_boost: 0.8,
            style: 0.3,
            use_speaker_boost: true
          }
        })
      });

      if (response.ok) {
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        setAudioUrl(audioUrl);
      } else {
        throw new Error('Erro na API Eleven Labs');
      }
    } catch (error) {
      console.error('Erro ao gerar áudio:', error);
      generateBrowserAudio(`${userName}, esta fue la frase que el cielo quiso que escucharas: Este plan es tu llave. No dudes más. ${userName}.`);
    } finally {
      setIsGeneratingAudio(false);
    }
  };

  const generateBrowserAudio = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      utterance.rate = 0.85;
      utterance.pitch = 1.0;
      utterance.volume = 0.9;
      
      const voices = speechSynthesis.getVoices();
      const spanishVoice = voices.find(voice => 
        voice.lang.includes('es') || voice.name.includes('Spanish')
      );
      
      if (spanishVoice) {
        utterance.voice = spanishVoice;
      }
      
      speechSynthesis.speak(utterance);
    }
  };

  const playAudio = () => {
    if (audioUrl && !isPlaying) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }

      const audio = new Audio(audioUrl);
      audio.loop = false;
      
      audio.play();
      setIsPlaying(true);
      setAudioElement(audio);
      audioRef.current = audio;
      
      audio.onended = () => {
        setIsPlaying(false);
        setAudioElement(null);
        audioRef.current = null;
      };

      audio.onerror = () => {
        setIsPlaying(false);
        setAudioElement(null);
        audioRef.current = null;
      };
    } else if (audioElement && isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
      setAudioElement(null);
      audioRef.current = null;
    }
  };

  const handleActivateCode = () => {
    // Track button click
    setButtonClicks(prev => prev + 1);
    setCTAInteractions(prev => prev + 1);

    // Track Facebook Pixel conversion
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'InitiateCheckout', {
        content_name: 'Divine Activation Plan',
        content_category: 'Spiritual Product',
        value: 9.00,
        currency: 'USD',
        divine_code: divineCode,
        user_name: userName,
        button_clicks: buttonClicks + 1,
        time_on_page: (30 * 60 - timeLeft),
        spots_remaining: availableSpots
      });

      // Track custom conversion event
      (window as any).fbq('trackCustom', 'DivineCodeActivation', {
        divine_code: divineCode,
        user_name: userName,
        conversion_type: 'offer_click',
        urgency_level: psychProfile.urgencyLevel,
        time_remaining: timeLeft,
        spots_remaining: availableSpots
      });
    }

    // Track analytics conversion
    trackConversion('offer_click', {
      divineCode,
      userName,
      buttonClicks: buttonClicks + 1,
      timeOnPage: (30 * 60 - timeLeft),
      spotsRemaining: availableSpots
    });

    // Parar qualquer áudio que esteja tocando
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    if (audioElement) {
      audioElement.pause();
    }
    setIsPlaying(false);
    
    // Redirecionar para o checkout
    window.location.href = 'https://plan.abundancemessage.online/checkout/181893675:1';
  };

  // Cleanup ao desmontar componente
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      if (audioElement) {
        audioElement.pause();
      }
    };
  }, [audioElement]);

  const getUserContext = () => {
    const contexts = [
      'frustración constante',
      'vergüenza por tu situación',
      'estrés que afecta tu sueño',
      'culpa por no poder ayudar a tu familia',
      'dudas sobre tu propósito divino',
      'ciclos de avance y retroceso',
      'oportunidades que no logras aprovechar',
      'un techo que limita tu crecimiento'
    ];
    
    return contexts[Math.floor(Math.random() * contexts.length)];
  };

  const userCurrentContext = getUserContext();
  const blockedPercentage = 73;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-gray-50 to-blue-50 py-8 px-4 pb-24">
      <div className="max-w-5xl mx-auto">
        {/* Urgency Timer - 30 MINUTOS */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 md:p-6 rounded-xl text-center mb-6 md:mb-8 shadow-2xl animate-pulse">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <Clock className="w-5 h-5 md:w-6 md:h-6 animate-bounce" />
            <span className="font-bold text-base md:text-lg">🚨 OFERTA CRÍTICA POR TIEMPO LIMITADO</span>
            <Clock className="w-5 h-5 md:w-6 md:h-6 animate-bounce" />
          </div>
          <div className="text-2xl md:text-4xl font-mono font-black mb-2">
            {formatTime(timeLeft)}
          </div>
          <p className="text-sm md:text-base opacity-90 font-medium">
            ⚠️ Tu Plan de Activación para Código {divineCode} expira pronto
          </p>
          <div className="mt-3 bg-white/20 rounded-full h-2">
            <div 
              className="h-2 bg-white rounded-full transition-all duration-1000"
              style={{ width: `${(timeLeft / (30 * 60)) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-200">
          {/* Header with Divine Authority */}
          <div className="text-center mb-6 md:mb-8">
            <div className="relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full opacity-20"></div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full flex items-center justify-center shadow-xl">
                  <Crown className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <span className="inline-block px-6 py-3 bg-blue-100 text-blue-800 rounded-full text-sm font-bold mb-4">
                🔓 PLAN DE ACTIVACIÓN DIVINA PERSONALIZADO
              </span>
            </div>
            
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-2">
              Plan Divino de Activación de 7 Días
            </h1>
            <h2 className="text-lg md:text-xl text-blue-600 font-semibold mb-4">
              Específicamente Calibrado Para Tu Código {divineCode}
            </h2>
            
            {/* Personalization Indicators */}
            <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4">
              <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-bold">
                ✨ Código {divineCode}
              </span>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-bold">
                🎯 Techo Invisible
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">
                ⚡ Resultados en 7 días
              </span>
            </div>

            {/* Interaction Counter */}
            <div className="bg-purple-50 rounded-lg p-3 mb-4 border border-purple-200">
              <div className="flex items-center justify-center space-x-4 text-sm">
                <div className="flex items-center space-x-1">
                  <Target className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700">Cliques: <strong>{buttonClicks}</strong></span>
                </div>
                <div className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700">Vagas: <strong>{availableSpots}</strong></span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4 text-purple-600" />
                  <span className="text-purple-700">Tempo: <strong>{formatTime(30 * 60 - timeLeft)}</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== TRANSFORMAÇÃO PERSONALIZADA BASADA EM RESPOSTAS ===== */}
          <div className="bg-gradient-to-r from-orange-50 via-red-50 to-pink-50 rounded-2xl p-6 md:p-8 mb-8 border border-orange-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-300/20 to-red-300/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-red-300/20 to-pink-300/20 rounded-full blur-xl"></div>

            <div className="relative z-10">
              <div className="text-center mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                  🔄 TU TRANSFORMACIÓN PERSONALIZADA
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* COMO ESTÁS AHORA */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-red-200">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">😔</span>
                    </div>
                    <h4 className="text-lg font-bold text-red-800 mb-3">
                      CÓMO ESTÁS AHORA:
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-red-100 rounded-lg p-3 border border-red-200">
                      <p className="text-red-800 font-medium text-sm">
                        ❌ Experimentando <span className="font-bold">{userCurrentContext}</span>
                      </p>
                    </div>
                    <div className="bg-red-100 rounded-lg p-3 border border-red-200">
                      <p className="text-red-800 font-medium text-sm">
                        ❌ Tu Código {divineCode} está <span className="font-bold">bloqueado al {blockedPercentage}%</span>
                      </p>
                    </div>
                    <div className="bg-red-100 rounded-lg p-3 border border-red-200">
                      <p className="text-red-800 font-medium text-sm">
                        ❌ Viviendo <span className="font-bold">muy por debajo</span> de tu potencial divino
                      </p>
                    </div>
                    <div className="bg-red-100 rounded-lg p-3 border border-red-200">
                      <p className="text-red-800 font-medium text-sm">
                        ❌ Sintiendo que <span className="font-bold">Dios no escucha</span> tus oraciones financieras
                      </p>
                    </div>
                  </div>
                </div>

                {/* COMO ESTARÁS DESPUÉS */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-green-200">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-xl">🌟</span>
                    </div>
                    <h4 className="text-lg font-bold text-green-800 mb-3">
                      CÓMO ESTARÁS EN 7 DÍAS:
                    </h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                      <p className="text-green-800 font-medium text-sm">
                        ✅ <span className="font-bold">Liberado</span> de la {userCurrentContext.replace('tu ', '').replace('tus ', '')}
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                      <p className="text-green-800 font-medium text-sm">
                        ✅ Tu Código {divineCode} funcionando al <span className="font-bold">95% de capacidad</span>
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                      <p className="text-green-800 font-medium text-sm">
                        ✅ <span className="font-bold">Oportunidades inesperadas</span> manifestándose diariamente
                      </p>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3 border border-green-200">
                      <p className="text-green-800 font-medium text-sm">
                        ✅ Sintiendo la <span className="font-bold">respuesta divina inmediata</span> a tus oraciones
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Flecha de transformação */}
              <div className="flex justify-center my-6">
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-2 md:px-6 md:py-3 rounded-full font-bold text-sm md:text-lg shadow-lg">
                  <span className="whitespace-nowrap">⚡ TRANSFORMACIÓN EN 7 DÍAS ⚡</span>
                </div>
              </div>
            </div>
          </div>

          {/* ===== BLOCO ESPECIAL DE MENSAGEM PESSOAL ===== */}
          {showPersonalMessage && userName && userName !== 'Amigo' && (
            <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 rounded-2xl p-6 md:p-8 mb-8 border border-blue-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full blur-2xl"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-300/20 to-purple-300/20 rounded-full blur-xl"></div>

              <div className="relative z-10">
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center space-x-3 mb-4">
                    <Volume2 className="w-8 h-8 text-blue-600" />
                    <h3 className="text-xl md:text-2xl font-bold text-blue-800">
                      Mensaje Personal Para {userName}
                    </h3>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-lg md:text-xl text-blue-700 leading-relaxed">
                    <span className="font-bold text-blue-800">{userName}</span>, esta no es una compra cualquiera.{' '}
                    <span className="font-bold">Esta es una respuesta divina para ti.</span>
                  </p>
                  <p className="text-base md:text-lg text-blue-600 mt-3 font-medium">
                    Dios no trabaja con coincidencias. Escucha esto primero.
                  </p>
                </div>

                {/* Componente de Áudio */}
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 mb-6 border border-blue-200">
                  {isGeneratingAudio && (
                    <div className="text-center">
                      <div className="flex items-center justify-center space-x-3 mb-3">
                        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <span className="text-blue-800 font-medium">
                          Generando mensaje divino para {userName}...
                        </span>
                      </div>
                      <div className="w-full bg-blue-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse w-3/4"></div>
                      </div>
                    </div>
                  )}

                  {audioUrl && !isGeneratingAudio && (
                    <div className="text-center">
                      <div className="mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 shadow-lg">
                          {isPlaying ? (
                            <Pause className="w-8 h-8 text-white" />
                          ) : (
                            <Play className="w-8 h-8 text-white ml-1" />
                          )}
                        </div>
                        <p className="text-blue-800 font-semibold">
                          🎵 Mensaje Divino Personalizado
                        </p>
                      </div>

                      <button
                        onClick={playAudio}
                        className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg ${
                          isPlaying ? 'animate-pulse' : ''
                        }`}
                      >
                        <span className="flex items-center justify-center space-x-3">
                          {isPlaying ? (
                            <>
                              <Pause className="w-5 h-5" />
                              <span>Pausar Mensaje</span>
                              <VolumeX className="w-5 h-5" />
                            </>
                          ) : (
                            <>
                              <Play className="w-5 h-5" />
                              <span>🎧 Escuchar Mensaje Divino</span>
                              <Volume2 className="w-5 h-5" />
                            </>
                          )}
                        </span>
                      </button>
                    </div>
                  )}

                  {!audioUrl && !isGeneratingAudio && (
                    <div className="text-center bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                      <h4 className="font-bold text-yellow-800 mb-2">
                        {userName}, esta fue la frase que el cielo quiso que escucharas:
                      </h4>
                      <p className="text-yellow-700 text-lg font-medium italic">
                        "Este plan es tu llave. No dudes más."
                      </p>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <button
                    onClick={handleActivateCode}
                    className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 hover:from-blue-700 hover:via-indigo-600 hover:to-blue-700 text-white font-black py-5 px-10 rounded-2xl transition-all duration-300 transform hover:scale-105 text-lg md:text-xl shadow-2xl relative overflow-hidden"
                    style={{
                      boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4), 0 0 30px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full animate-pulse rounded-2xl"></div>
                    
                    <span className="relative flex items-center justify-center space-x-3">
                      <Crown className="w-6 h-6" />
                      <span className="tracking-wide">ACTIVAR MI CÓDIGO DIVINO AHORA</span>
                      <ArrowRight className="w-6 h-6" />
                    </span>
                  </button>

                  <p className="text-blue-600 text-sm mt-3 font-medium">
                    ✨ Respuesta divina personalizada para tu Código {divineCode}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* PROMOÇÃO ESPECIAL - TUDO POR $9 HOJE */}
          <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border-2 border-red-200">
            <div className="text-center">
              <h2 className="text-2xl md:text-3xl font-black text-red-800 mb-4">
                🔥 PROMOCIÓN ESPECIAL DE HOY 🔥
              </h2>
              
              <div className="bg-white rounded-xl p-6 mb-6 border-2 border-red-300">
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <div className="text-4xl md:text-6xl font-black text-gray-400 line-through">
                    $297
                  </div>
                  <div className="text-6xl md:text-8xl font-black text-green-600">
                    $9
                  </div>
                </div>
                
                <p className="text-xl md:text-2xl font-bold text-red-700 mb-2">
                  ¡TODO EL SISTEMA COMPLETO POR SOLO $9!
                </p>
                <p className="text-red-600 font-medium">
                  Incluye TODOS los módulos + TODOS los bónus (Valor total: $938)
                </p>
              </div>

              <div className="bg-red-200 rounded-lg p-4 border border-red-300">
                <p className="text-red-800 font-bold text-lg">
                  ⚠️ Esta promoción termina cuando el contador llegue a CERO
                </p>
                <p className="text-red-700 text-sm mt-1">
                  Después volverá al precio normal de $297
                </p>
              </div>
            </div>
          </div>

          {/* Main System Modules */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border border-blue-200">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-blue-800 mb-2">
                🎯 SISTEMA COMPLETO DE ACTIVACIÓN
              </h3>
              <p className="text-blue-700 text-sm md:text-base">
                Cada módulo está calibrado específicamente para tu Código {divineCode}
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {personalizedOffer.mainModules.map((module, index) => (
                <div key={index} className="bg-white rounded-xl p-4 md:p-6 border border-blue-200 hover:shadow-lg transition-shadow">
                  <div className="text-center mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-white font-bold text-lg">{index + 1}</span>
                    </div>
                    <h4 className="font-bold text-blue-800 text-sm md:text-base mb-2">
                      {module.name}
                    </h4>
                  </div>
                  <p className="text-blue-700 text-xs md:text-sm mb-3 text-center">
                    {module.description}
                  </p>
                  <div className="text-center">
                    <span className="inline-block px-3 py-1 bg-blue-200 text-blue-800 rounded-full text-xs font-bold line-through opacity-60">
                      Valor: {module.value}
                    </span>
                    <div className="text-green-600 font-bold mt-1">¡INCLUIDO HOY!</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic Bonuses */}
          <div className="bg-gradient-to-r from-yellow-100 to-orange-100 rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border-2 border-yellow-200">
            <div className="text-center mb-6">
              <h3 className="text-xl md:text-2xl font-bold text-orange-800 mb-2">
                🎁 BÓNUS ESTRATÉGICOS INCLUIDOS
              </h3>
              <p className="text-orange-700 text-sm md:text-base">
                Solo para personas con Código {divineCode} - ¡TODO INCLUIDO POR $9!
              </p>
            </div>

            <div className="space-y-4">
              {personalizedOffer.strategicBonuses.map((bonus, index) => (
                <div key={index} className="flex items-start space-x-4 bg-white rounded-xl p-4 md:p-6 border border-orange-200">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Gift className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-orange-800 text-sm md:text-base mb-1">
                      {bonus.name}
                    </h4>
                    <p className="text-orange-700 text-xs md:text-sm mb-2">
                      {bonus.description}
                    </p>
                    <div className="flex items-center space-x-2">
                      <span className="inline-block px-3 py-1 bg-orange-200 text-orange-800 rounded-full text-xs font-bold line-through opacity-60">
                        Valor: {bonus.value}
                      </span>
                      <span className="text-green-600 font-bold text-sm">¡GRATIS HOY!</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 text-center">
              <div className="inline-block px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-bold">
                💎 Valor Total de Bónus: <span className="line-through opacity-70">$641</span> ¡GRATIS!
              </div>
            </div>
          </div>

          {/* PROVAS SOCIAIS */}
          <div className="mb-6 md:mb-8">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 text-center">
              ✨ Cristianos con tu mismo Código {divineCode} ya están transformando sus vidas:
            </h3>
            <div className="grid md:grid-cols-3 gap-4 md:gap-6">
              {personalizedOffer.testimonials.map((testimonial, index) => (
                <div key={index} className="bg-yellow-50 rounded-xl p-4 md:p-6 border-2 border-yellow-200 hover:shadow-lg transition-shadow">
                  <div className="flex items-center space-x-2 mb-3">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm md:text-base">{testimonial.name}</span>
                  </div>
                  <div className="mb-3">
                    <span className="bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full font-bold">
                      Código: {testimonial.code}
                    </span>
                  </div>
                  <p className="text-gray-700 text-xs md:text-sm mb-3 italic">"{testimonial.result}"</p>
                  <div className="text-green-600 font-bold text-xs md:text-sm">
                    ⚡ Resultado en {testimonial.days}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guarantees */}
          <div className="bg-blue-50 rounded-xl p-6 md:p-8 mb-6 md:mb-8 border-2 border-blue-200">
            <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-4 text-center">
              🛡️ GARANTÍAS DOBLES PARA TU TRANQUILIDAD:
            </h3>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {personalizedOffer.guarantees.map((guarantee, index) => (
                <div key={index} className="flex items-start space-x-3 bg-white rounded-lg p-4 border border-blue-200">
                  <Shield className="w-6 h-6 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-blue-800 text-sm md:text-base mb-1">{guarantee.name}</p>
                    <p className="text-blue-700 text-xs md:text-sm">{guarantee.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOTÃO PRINCIPAL DE AÇÃO COM CONTADOR */}
          <div className="text-center mb-6">
            <div className="relative">
              <div className="absolute -inset-6 rounded-2xl bg-gradient-to-r from-blue-500 to-indigo-500 opacity-30 animate-ping"></div>
              <div className="absolute -inset-8 rounded-2xl bg-gradient-to-r from-blue-400 to-indigo-400 opacity-20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              
              <button
                onClick={handleActivateCode}
                className="bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-600 hover:from-blue-700 hover:via-indigo-600 hover:to-blue-700 text-white font-black py-6 px-12 rounded-2xl transition-all duration-300 transform hover:scale-105 text-xl md:text-2xl shadow-2xl relative overflow-hidden"
                style={{
                  boxShadow: '0 20px 40px rgba(59, 130, 246, 0.4), 0 0 30px rgba(99, 102, 241, 0.3)'
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full animate-pulse rounded-2xl"></div>
                
                <span className="relative flex items-center justify-center space-x-3">
                  <Crown className="w-8 h-8" />
                  <span className="tracking-wide">ACTIVAR POR SOLO $9</span>
                  <ArrowRight className="w-8 h-8" />
                </span>
              </button>
            </div>
            
            <p className="text-blue-600 text-lg font-bold mt-4">
              💎 Plan completo + Todos los bónus = $9 (Valor normal: $938)
            </p>
            
            {/* Click Counter Display */}
            <div className="mt-3 text-sm text-gray-600">
              Has hecho clic {buttonClicks} {buttonClicks === 1 ? 'vez' : 'veces'} • {ctaInteractions} interacciones totales
            </div>
          </div>

          {/* Final CTA with Urgency */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-xl p-4 md:p-6 mb-6 border-2 border-red-200">
              <div className="flex items-center justify-center space-x-2 mb-3">
                <Users className="w-5 h-5 text-orange-600" />
                <span className="text-orange-600 font-semibold text-sm md:text-base">
                  Solo quedan {availableSpots} vagas para este grupo de implementación
                </span>
              </div>
              
              <p className="text-gray-700 mb-4 text-sm md:text-base">
                Tu Código {divineCode} está esperando ser activado. 
                No dejes que pase otro día viviendo por debajo de tu potencial divino.
              </p>

              <div className="bg-red-200 rounded-lg p-3 mb-4 border border-red-300">
                <p className="text-red-700 font-semibold text-sm md:text-base">
                  ⚠️ Esta promoción de $9 termina cuando el contador llegue a cero
                </p>
              </div>
            </div>

            <p className="text-xs md:text-sm text-gray-500">
              🔒 Compra segura - SSL 256 bits | Garantía incondicional de 7 días
            </p>
          </div>
        </div>
      </div>

      {/* Floating CTA Button with Counter */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-blue-200 p-4 shadow-lg z-50">
        <div className="max-w-md mx-auto">
          <button 
            onClick={handleActivateCode}
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300"
          >
            <span className="flex items-center justify-center space-x-2">
              <span className="text-lg">🔓 ACTIVAR POR $9</span>
              <ArrowRight className="w-5 h-5" />
            </span>
          </button>
          <p className="text-center text-xs text-gray-500 mt-2">
            💎 Plan completo • ⏰ Expira en {formatTime(timeLeft)} • 🎯 {availableSpots} vagas • 👆 {buttonClicks} cliques
          </p>
        </div>
      </div>
    </div>
  );
}