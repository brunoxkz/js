import React from 'react';
import { useQuizState } from './hooks/useQuizState';
import { useBackgroundAudio } from './hooks/useBackgroundAudio';
import { LandingStep } from './components/steps/LandingStep';
import { BirthdateStep } from './components/steps/BirthdateStep';
import { ColorSelectionStep } from './components/steps/ColorSelectionStep';
import { NameCaptureStep } from './components/steps/NameCaptureStep';
import { FavoriteNumberStep } from './components/steps/FavoriteNumberStep';
import { DestinyWheelStep } from './components/steps/DestinyWheelStep';
import { ProcessingCodeStep } from './components/steps/ProcessingCodeStep';
import { CodeRevealStep } from './components/steps/CodeRevealStep';
import { QuizStep } from './components/steps/QuizStep';
import { BlockTransitionStep } from './components/steps/BlockTransitionStep';
import { ProcessingFinalStep } from './components/steps/ProcessingFinalStep';
import { DiagnosisStep } from './components/steps/DiagnosisStep';
import { LiberationRitualStep } from './components/steps/LiberationRitualStep';
import { WallBreakingStep } from './components/steps/WallBreakingStep';
import { OfferStep } from './components/steps/OfferStep';
import { AdminDashboard } from './components/admin/AdminDashboard';

function App() {
  const {
    currentStep,
    userData,
    currentQuestionIndex,
    updateBirthDate,
    updateName,
    updateColor,
    updateFavoriteNumber,
    updateAnswer,
    nextStep,
    nextQuestion,
    getCurrentBlockType,
    isBlockComplete,
    getStepNumber,
    getTotalSteps,
    handleBlockTransition,
    getTransitionData,
    completeBlockTransition
  } = useQuizState();

  // Inicializar som de fundo do root chakra automaticamente
  useBackgroundAudio();

  // Check if we're in admin mode - improved detection
  const [isAdminMode, setIsAdminMode] = React.useState(() => {
    return window.location.pathname === '/admin' || 
           window.location.hash === '#admin' ||
           window.location.search.includes('admin=true');
  });

  // Listen for hash changes
  React.useEffect(() => {
    const handleHashChange = () => {
      setIsAdminMode(
        window.location.pathname === '/admin' || 
        window.location.hash === '#admin' ||
        window.location.search.includes('admin=true')
      );
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleExitAdmin = () => {
    window.location.hash = '';
    setIsAdminMode(false);
  };

  if (isAdminMode) {
    return (
      <div>
        <AdminDashboard />
        {/* Exit Admin Button */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={handleExitAdmin}
            className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-2 rounded-lg shadow-lg transition-colors flex items-center space-x-2"
          >
            <span>← Voltar ao Quiz</span>
          </button>
        </div>
      </div>
    );
  }

  // Função para obter a resposta emocional (resposta7)
  const getEmotionalAnswer = () => {
    // Procurar por respostas que indiquem vulnerabilidade emocional
    const emotionalAnswers = Object.values(userData.answers);
    
    // Buscar por padrões emocionais específicos
    const emotionalPatterns = [
      'financial-shame', 'chronic-stress', 'provider-guilt', 'spiritual-doubt',
      'shame', 'stress', 'guilt', 'doubt', 'frustration', 'vergüenza', 'culpa'
    ];
    
    for (const answer of emotionalAnswers) {
      for (const pattern of emotionalPatterns) {
        if (answer.toLowerCase().includes(pattern)) {
          // Mapear para texto em espanhol
          if (pattern.includes('shame') || pattern.includes('vergüenza')) return 'Vergüenza';
          if (pattern.includes('stress')) return 'Estrés crónico';
          if (pattern.includes('guilt') || pattern.includes('culpa')) return 'Culpa';
          if (pattern.includes('doubt')) return 'Dudas espirituales';
          if (pattern.includes('frustration')) return 'Frustración';
        }
      }
    }
    
    // Valor padrão em espanhol
    return 'Frustración';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 'landing':
        return <LandingStep onNext={nextStep} />;
        
      case 'birthdate':
        return (
          <BirthdateStep 
            onNext={nextStep} 
            onUpdateBirthDate={updateBirthDate}
          />
        );

      case 'color-selection':
        return (
          <ColorSelectionStep
            onNext={nextStep}
            onUpdateColor={updateColor}
          />
        );

      case 'name-capture':
        return (
          <NameCaptureStep
            onNext={nextStep}
            onUpdateName={updateName}
            selectedColor={userData.selectedColor}
          />
        );

      case 'favorite-number':
        return (
          <FavoriteNumberStep
            onNext={nextStep}
            onUpdateNumber={updateFavoriteNumber}
            selectedColor={userData.selectedColor}
          />
        );

      case 'destiny-wheel':
        return (
          <DestinyWheelStep
            onNext={nextStep}
            birthDay={userData.birthDate.day}
            birthMonth={userData.birthDate.month}
          />
        );
        
      case 'processing-code':
        return <ProcessingCodeStep onNext={nextStep} />;
        
      case 'code-reveal':
        return (
          <CodeRevealStep 
            divineCode={userData.divineCode}
            onNext={nextStep} 
          />
        );
        
      case 'quiz':
        return (
          <QuizStep 
            divineCode={userData.divineCode}
            currentQuestionIndex={currentQuestionIndex}
            onAnswer={updateAnswer}
            onNext={nextStep}
            onNextQuestion={nextQuestion}
            onBlockTransition={handleBlockTransition}
            isBlockComplete={isBlockComplete}
            getCurrentBlockType={getCurrentBlockType}
          />
        );

      case 'block-transition':
        const transitionData = getTransitionData();
        return (
          <BlockTransitionStep
            fromBlockType={transitionData.fromBlockType!}
            toBlockType={transitionData.toBlockType}
            divineCode={userData.divineCode}
            userName={userData.name}
            onNext={completeBlockTransition}
          />
        );
        
      case 'processing-final':
        return <ProcessingFinalStep onNext={nextStep} />;
        
      case 'diagnosis':
        return (
          <DiagnosisStep 
            divineCode={userData.divineCode}
            diagnosis={userData.diagnosis}
            onNext={nextStep}
          />
        );

      case 'liberation-ritual':
        return (
          <LiberationRitualStep
            onNext={nextStep}
            divineCode={userData.divineCode}
            emotionalAnswer={getEmotionalAnswer()}
          />
        );

      case 'wall-breaking':
        return (
          <WallBreakingStep
            onNext={nextStep}
            divineCode={userData.divineCode}
          />
        );
        
      case 'offer':
        return (
          <OfferStep 
            divineCode={userData.divineCode}
            userName={userData.name}
          />
        );
        
      default:
        return <LandingStep onNext={nextStep} />;
    }
  };

  return (
    <div className="min-h-screen">
      {renderStep()}
    </div>
  );
}

export default App;