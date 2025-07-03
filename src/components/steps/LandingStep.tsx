import React from 'react';
import { Shield, Star, Sparkles } from 'lucide-react';
import { usePersonalization } from '../../hooks/usePersonalization';
import { InterventionModal } from '../personalization/InterventionModal';
import { ImmersiveEffects } from '../personalization/ImmersiveEffects';
import { BackRedirectModal } from '../personalization/BackRedirectModal';

interface LandingStepProps {
  onNext: () => void;
}

export function LandingStep({ onNext }: LandingStepProps) {
  const { 
    personalization, 
    setInterventionCallbacks, 
    resetStepTracking, 
    triggerHapticFeedback 
  } = usePersonalization();
  
  const [showInterventionModal, setShowInterventionModal] = React.useState(false);
  const [showBackRedirectModal, setShowBackRedirectModal] = React.useState(false);
  const [interventionType, setInterventionType] = React.useState<'exit-intent' | 'back-redirect' | 'engagement-boost'>('exit-intent');

  // Set up intervention callbacks
  React.useEffect(() => {
    setInterventionCallbacks({
      onExitIntent: () => {
        setInterventionType('exit-intent');
        setShowInterventionModal(true);
        triggerHapticFeedback('heavy');
      },
      onBackRedirect: () => {
        setShowBackRedirectModal(true);
        triggerHapticFeedback('medium');
      },
      onEngagementDrop: () => {
        setInterventionType('engagement-boost');
        setShowInterventionModal(true);
        triggerHapticFeedback('light');
      }
    });

    resetStepTracking();
  }, [setInterventionCallbacks, resetStepTracking, triggerHapticFeedback]);

  const handleNext = () => {
    triggerHapticFeedback('light');
    onNext();
  };

  const handleInterventionContinue = () => {
    setShowInterventionModal(false);
    triggerHapticFeedback('medium');
    onNext();
  };

  const handleBackRedirectContinue = () => {
    setShowBackRedirectModal(false);
    triggerHapticFeedback('medium');
    onNext();
  };

  return (
    <ImmersiveEffects 
      personalizedContent={personalization.personalizedContent}
      emotionalState={personalization.userBehavior.emotionalState}
    >
      <div className="min-h-screen flex items-center justify-center px-4 py-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Hero Icon */}
          <div className="mb-8 relative">
            <div className={`w-24 h-24 mx-auto bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg ${
              personalization.personalizedContent.animationIntensity === 'intense' ? 'animate-bounce' : 'animate-pulse'
            }`}>
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            {/* Mantida a estrela pequena conforme solicitado */}
            <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-300 rounded-full flex items-center justify-center">
              <Star className="w-4 h-4 text-yellow-700" />
            </div>
          </div>

          {/* Adaptive Headline */}
          <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight ${
            personalization.personalizedContent.urgencyLevel === 'critical' ? 'animate-pulse' : ''
          }`}>
            <span className="text-yellow-600">DESCUBRE</span> Por Qué Dios Ha Permitido Un{' '}
            <span className="relative">
              'Techo Invisible'
              <div className="absolute -bottom-1 left-0 w-full h-2 bg-yellow-400 opacity-50 rounded"></div>
            </span>
            {' '}Sobre Tu Prosperidad
          </h1>

          <h2 className="text-xl md:text-2xl text-gray-700 mb-6 font-medium">
            (Y Cómo Romperlo En 7 Días)
          </h2>

          {/* Subheadline */}
          <div className="bg-white/70 backdrop-blur-sm rounded-xl p-6 mb-6 border border-yellow-200 shadow-lg">
            <h3 className="text-lg md:text-xl text-gray-800 font-semibold mb-2">
              Este Test Revelador Descubrirá El Código Oculto En Tu Fecha De Nacimiento
            </h3>
            <p className="text-gray-700">
              Que Desbloquea Tu Destino Financiero
            </p>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mb-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-green-600" />
              <span>100% Bíblico</span>
            </div>
            <div className="flex items-center space-x-2">
              {/* Transformado em 5 estrelas pequenas conforme solicitado */}
              <div className="flex space-x-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 text-yellow-600 fill-current" />
                ))}
              </div>
              <span>Resultados en 7 Días</span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Completamente Personalizado</span>
            </div>
          </div>

          {/* Adaptive CTA Button */}
          <div className="mb-6">
            <button
              onClick={handleNext}
              className={`group relative bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white text-xl font-bold py-5 px-8 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 ${
                personalization.personalizedContent.urgencyLevel === 'critical' ? 'animate-pulse' : ''
              } ${
                personalization.personalizedContent.animationIntensity === 'intense' ? 'animate-bounce' : ''
              }`}
            >
              {/* Adaptive pulsing rings */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl opacity-30 animate-ping"></div>
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-300 to-orange-400 rounded-xl opacity-20 animate-ping" style={{ animationDelay: '0.5s' }}></div>
              
              <span className="relative flex items-center justify-center space-x-2">
                <span>REVELAR MI CÓDIGO DIVINO AHORA</span>
                <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[4px] border-y-transparent ml-0.5"></div>
                </div>
              </span>
            </button>
          </div>

          {/* Adaptive Social Proof */}
          <p className="text-sm text-gray-500 mb-20">
            Más de <span className="font-semibold text-yellow-600">
              {personalization.userBehavior.emotionalState === 'leaving' ? '15,247' : '12,847'}
            </span> cristianos ya han descubierto su Código Divino
            {personalization.userBehavior.emotionalState === 'hesitant' && (
              <span className="block mt-1 text-green-600 font-medium">
                ✅ 97% reporta cambios positivos en 7 días
              </span>
            )}
          </p>
        </div>

        {/* BOTÃO FLUTUANTE */}
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4">
          <div className="absolute -inset-4 rounded-2xl border-2 border-yellow-400 opacity-30 animate-ping pointer-events-none"></div>
          <div className="absolute -inset-6 rounded-2xl border-2 border-orange-400 opacity-20 animate-ping pointer-events-none" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -inset-8 rounded-2xl border-2 border-yellow-300 opacity-15 animate-ping pointer-events-none" style={{ animationDelay: '1s' }}></div>
          
          <button
            onClick={handleNext}
            className={`w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold py-5 px-6 rounded-2xl transform hover:scale-105 transition-all duration-300 relative overflow-hidden ${
              personalization.personalizedContent.urgencyLevel === 'critical' ? 'animate-pulse' : ''
            }`}
            style={{
              boxShadow: '0 20px 40px rgba(245, 158, 11, 0.4), 0 0 30px rgba(245, 158, 11, 0.3), 0 0 60px rgba(245, 158, 11, 0.2)'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12 -translate-x-full animate-pulse"></div>
            
            <div className="absolute inset-0 overflow-hidden rounded-2xl">
              <div className="absolute top-2 left-4 w-2 h-2 bg-white/40 rounded-full animate-bounce"></div>
              <div className="absolute top-4 right-6 w-1 h-1 bg-white/60 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></div>
              <div className="absolute bottom-3 left-8 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce" style={{ animationDelay: '0.6s' }}></div>
              <div className="absolute bottom-2 right-4 w-1 h-1 bg-white/40 rounded-full animate-bounce" style={{ animationDelay: '0.9s' }}></div>
            </div>
            
            <span className="relative flex items-center justify-center space-x-3">
              <Sparkles className="w-6 h-6 animate-spin" />
              <span className="text-xl font-black tracking-wide">INICIAR TEST DIVINO</span>
              <Sparkles className="w-6 h-6 animate-spin" style={{ animationDirection: 'reverse' }} />
            </span>
          </button>
        </div>
      </div>

      {/* Intervention Modal */}
      <InterventionModal
        type={interventionType}
        isOpen={showInterventionModal}
        onClose={() => setShowInterventionModal(false)}
        onContinue={handleInterventionContinue}
        personalizedContent={personalization.personalizedContent}
      />

      {/* Back Redirect Modal */}
      <BackRedirectModal
        isOpen={showBackRedirectModal}
        onClose={() => setShowBackRedirectModal(false)}
        onContinue={handleBackRedirectContinue}
      />
    </ImmersiveEffects>
  );
}