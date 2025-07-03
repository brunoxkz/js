import { useState, useEffect, useCallback, useRef } from 'react';

interface UserBehavior {
  mouseMovements: Array<{ x: number; y: number; timestamp: number }>;
  scrollPattern: Array<{ position: number; timestamp: number; direction: 'up' | 'down' }>;
  clickHesitation: Array<{ element: string; hesitationTime: number; timestamp: number }>;
  timeOnStep: number;
  backButtonAttempts: number;
  exitIntentions: number;
  engagementScore: number;
  emotionalState: 'excited' | 'hesitant' | 'confused' | 'engaged' | 'leaving';
}

interface PersonalizationState {
  userBehavior: UserBehavior;
  interventions: Array<{
    type: 'exit-intent' | 'hesitation' | 'back-redirect' | 'engagement-boost';
    triggered: boolean;
    timestamp: number;
  }>;
  personalizedContent: {
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    colorScheme: 'warm' | 'cool' | 'energetic' | 'calming';
    animationIntensity: 'subtle' | 'moderate' | 'intense';
    messageStyle: 'encouraging' | 'urgent' | 'reassuring' | 'direct';
  };
}

// Detectar tipo de dispositivo
const isMobile = () => {
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

const isAndroid = () => {
  return /Android/i.test(navigator.userAgent);
};

const isIOS = () => {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
};

export function usePersonalization() {
  const [personalization, setPersonalization] = useState<PersonalizationState>({
    userBehavior: {
      mouseMovements: [],
      scrollPattern: [],
      clickHesitation: [],
      timeOnStep: 0,
      backButtonAttempts: 0,
      exitIntentions: 0,
      engagementScore: 50,
      emotionalState: 'engaged'
    },
    interventions: [],
    personalizedContent: {
      urgencyLevel: 'medium',
      colorScheme: 'warm',
      animationIntensity: 'moderate',
      messageStyle: 'encouraging'
    }
  });

  const stepStartTime = useRef<number>(Date.now());
  const lastMousePosition = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseIdleTimer = useRef<NodeJS.Timeout>();
  const exitIntentTimer = useRef<NodeJS.Timeout>();
  const interventionCallbacks = useRef<{
    onExitIntent?: () => void;
    onBackRedirect?: () => void;
    onEngagementDrop?: () => void;
  }>({});

  // Mouse movement tracking
  const trackMouseMovement = useCallback((e: MouseEvent) => {
    const now = Date.now();
    const movement = { x: e.clientX, y: e.clientY, timestamp: now };
    
    setPersonalization(prev => {
      const newMovements = [...prev.userBehavior.mouseMovements, movement].slice(-50);
      
      const recentMovements = newMovements.slice(-10);
      const avgSpeed = recentMovements.length > 1 
        ? recentMovements.reduce((acc, curr, idx) => {
            if (idx === 0) return 0;
            const prev = recentMovements[idx - 1];
            const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
            const time = curr.timestamp - prev.timestamp;
            return acc + (distance / time);
          }, 0) / (recentMovements.length - 1)
        : 0;

      const isErratic = avgSpeed > 2 && recentMovements.length > 5;
      
      return {
        ...prev,
        userBehavior: {
          ...prev.userBehavior,
          mouseMovements: newMovements,
          emotionalState: isErratic ? 'confused' : prev.userBehavior.emotionalState
        }
      };
    });

    lastMousePosition.current = { x: e.clientX, y: e.clientY };
    
    if (mouseIdleTimer.current) {
      clearTimeout(mouseIdleTimer.current);
    }
    
    mouseIdleTimer.current = setTimeout(() => {
      setPersonalization(prev => ({
        ...prev,
        userBehavior: {
          ...prev.userBehavior,
          emotionalState: 'hesitant'
        }
      }));
    }, 3000);
  }, []);

  // Exit intent detection
  const detectExitIntent = useCallback((e: MouseEvent) => {
    if (e.clientY <= 5 && e.movementY < 0) {
      setPersonalization(prev => {
        const newExitIntentions = prev.userBehavior.exitIntentions + 1;
        
        if (newExitIntentions === 1 && !prev.interventions.some(i => i.type === 'exit-intent')) {
          interventionCallbacks.current.onExitIntent?.();
          
          return {
            ...prev,
            userBehavior: {
              ...prev.userBehavior,
              exitIntentions: newExitIntentions,
              emotionalState: 'leaving'
            },
            interventions: [...prev.interventions, {
              type: 'exit-intent',
              triggered: true,
              timestamp: Date.now()
            }],
            personalizedContent: {
              ...prev.personalizedContent,
              urgencyLevel: 'critical',
              messageStyle: 'urgent'
            }
          };
        }
        
        return {
          ...prev,
          userBehavior: {
            ...prev.userBehavior,
            exitIntentions: newExitIntentions
          }
        };
      });
    }
  }, []);

  // Scroll pattern tracking
  const trackScrollPattern = useCallback(() => {
    const scrollPosition = window.pageYOffset;
    const now = Date.now();
    
    setPersonalization(prev => {
      const lastScroll = prev.userBehavior.scrollPattern[prev.userBehavior.scrollPattern.length - 1];
      const direction = lastScroll && scrollPosition > lastScroll.position ? 'down' : 'up';
      
      const newScrollPattern = [...prev.userBehavior.scrollPattern, {
        position: scrollPosition,
        timestamp: now,
        direction
      }].slice(-30);
      
      const recentScrolls = newScrollPattern.slice(-5);
      const isRapidScrolling = recentScrolls.length === 5 && 
        (recentScrolls[4].timestamp - recentScrolls[0].timestamp) < 1000;
      
      return {
        ...prev,
        userBehavior: {
          ...prev.userBehavior,
          scrollPattern: newScrollPattern,
          emotionalState: isRapidScrolling ? 'confused' : prev.userBehavior.emotionalState
        }
      };
    });
  }, []);

  // Back button detection and redirect - UNIVERSAL
  const handleBackButton = useCallback(() => {
    setPersonalization(prev => {
      const newBackAttempts = prev.userBehavior.backButtonAttempts + 1;
      
      // Trigger back redirect intervention SEMPRE
      if (!prev.interventions.some(i => i.type === 'back-redirect')) {
        interventionCallbacks.current.onBackRedirect?.();
        
        return {
          ...prev,
          userBehavior: {
            ...prev.userBehavior,
            backButtonAttempts: newBackAttempts,
            emotionalState: 'hesitant'
          },
          interventions: [...prev.interventions, {
            type: 'back-redirect',
            triggered: true,
            timestamp: Date.now()
          }],
          personalizedContent: {
            ...prev.personalizedContent,
            urgencyLevel: 'high',
            messageStyle: 'reassuring'
          }
        };
      }
      
      return {
        ...prev,
        userBehavior: {
          ...prev.userBehavior,
          backButtonAttempts: newBackAttempts
        }
      };
    });
  }, []);

  // Click hesitation tracking
  const trackClickHesitation = useCallback((elementId: string, startTime: number) => {
    const hesitationTime = Date.now() - startTime;
    
    if (hesitationTime > 1000) {
      setPersonalization(prev => ({
        ...prev,
        userBehavior: {
          ...prev.userBehavior,
          clickHesitation: [...prev.userBehavior.clickHesitation, {
            element: elementId,
            hesitationTime,
            timestamp: Date.now()
          }].slice(-10),
          emotionalState: hesitationTime > 3000 ? 'confused' : 'hesitant'
        }
      }));
    }
  }, []);

  // Engagement score calculation
  const calculateEngagementScore = useCallback(() => {
    setPersonalization(prev => {
      const { userBehavior } = prev;
      let score = 50;
      
      const timeOnStep = Date.now() - stepStartTime.current;
      if (timeOnStep > 30000) score -= 20;
      if (timeOnStep < 5000) score -= 10;
      
      const recentMovements = userBehavior.mouseMovements.slice(-20);
      if (recentMovements.length < 5) score -= 15;
      
      const recentScrolls = userBehavior.scrollPattern.slice(-10);
      if (recentScrolls.length > 0) score += 10;
      
      const recentHesitations = userBehavior.clickHesitation.filter(
        h => Date.now() - h.timestamp < 30000
      );
      score -= recentHesitations.length * 5;
      
      score -= userBehavior.exitIntentions * 15;
      score -= userBehavior.backButtonAttempts * 10;
      
      score = Math.max(0, Math.min(100, score));
      
      if (score < 30 && !prev.interventions.some(i => i.type === 'engagement-boost')) {
        interventionCallbacks.current.onEngagementDrop?.();
        
        return {
          ...prev,
          userBehavior: {
            ...prev.userBehavior,
            engagementScore: score
          },
          interventions: [...prev.interventions, {
            type: 'engagement-boost',
            triggered: true,
            timestamp: Date.now()
          }],
          personalizedContent: {
            ...prev.personalizedContent,
            urgencyLevel: 'high',
            animationIntensity: 'intense',
            messageStyle: 'encouraging'
          }
        };
      }
      
      return {
        ...prev,
        userBehavior: {
          ...prev.userBehavior,
          engagementScore: score
        }
      };
    });
  }, []);

  // Personalized content adaptation
  const adaptContent = useCallback(() => {
    setPersonalization(prev => {
      const { emotionalState, engagementScore } = prev.userBehavior;
      
      let newContent = { ...prev.personalizedContent };
      
      switch (emotionalState) {
        case 'excited':
          newContent = {
            urgencyLevel: 'medium',
            colorScheme: 'energetic',
            animationIntensity: 'intense',
            messageStyle: 'encouraging'
          };
          break;
          
        case 'hesitant':
          newContent = {
            urgencyLevel: 'high',
            colorScheme: 'warm',
            animationIntensity: 'moderate',
            messageStyle: 'reassuring'
          };
          break;
          
        case 'confused':
          newContent = {
            urgencyLevel: 'low',
            colorScheme: 'calming',
            animationIntensity: 'subtle',
            messageStyle: 'direct'
          };
          break;
          
        case 'leaving':
          newContent = {
            urgencyLevel: 'critical',
            colorScheme: 'energetic',
            animationIntensity: 'intense',
            messageStyle: 'urgent'
          };
          break;
          
        default:
          if (engagementScore > 70) {
            newContent = {
              urgencyLevel: 'medium',
              colorScheme: 'warm',
              animationIntensity: 'moderate',
              messageStyle: 'encouraging'
            };
          } else if (engagementScore < 40) {
            newContent = {
              urgencyLevel: 'high',
              colorScheme: 'energetic',
              animationIntensity: 'intense',
              messageStyle: 'urgent'
            };
          }
      }
      
      return {
        ...prev,
        personalizedContent: newContent
      };
    });
  }, []);

  // Initialize tracking
  useEffect(() => {
    stepStartTime.current = Date.now();
    
    // Add event listeners
    document.addEventListener('mousemove', trackMouseMovement);
    document.addEventListener('mousemove', detectExitIntent);
    window.addEventListener('scroll', trackScrollPattern);
    
    // Back button detection - UNIVERSAL para todos os dispositivos
    const handlePopState = (e: PopStateEvent) => {
      e.preventDefault();
      handleBackButton();
      // Prevent actual back navigation
      window.history.pushState(null, '', window.location.href);
    };
    
    // Add initial history state
    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handlePopState);
    
    // Para dispositivos móveis - detectar gestos de voltar
    if (isMobile()) {
      // Detectar swipe para voltar (iOS)
      let touchStartX = 0;
      let touchStartY = 0;
      
      const handleTouchStart = (e: TouchEvent) => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      };
      
      const handleTouchMove = (e: TouchEvent) => {
        if (!touchStartX || !touchStartY) return;
        
        const touchEndX = e.touches[0].clientX;
        const touchEndY = e.touches[0].clientY;
        
        const diffX = touchStartX - touchEndX;
        const diffY = touchStartY - touchEndY;
        
        // Swipe para a direita (voltar) no iOS
        if (Math.abs(diffX) > Math.abs(diffY) && diffX < -100 && touchStartX < 50) {
          handleBackButton();
        }
      };
      
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: true });
      
      // Cleanup mobile listeners
      return () => {
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
      };
    }
    
    // Engagement calculation interval
    const engagementInterval = setInterval(calculateEngagementScore, 5000);
    
    // Content adaptation interval
    const adaptationInterval = setInterval(adaptContent, 3000);
    
    return () => {
      document.removeEventListener('mousemove', trackMouseMovement);
      document.removeEventListener('mousemove', detectExitIntent);
      window.removeEventListener('scroll', trackScrollPattern);
      window.removeEventListener('popstate', handlePopState);
      
      if (mouseIdleTimer.current) clearTimeout(mouseIdleTimer.current);
      if (exitIntentTimer.current) clearTimeout(exitIntentTimer.current);
      
      clearInterval(engagementInterval);
      clearInterval(adaptationInterval);
    };
  }, [trackMouseMovement, detectExitIntent, trackScrollPattern, handleBackButton, calculateEngagementScore, adaptContent]);

  // Public methods
  const setInterventionCallbacks = useCallback((callbacks: {
    onExitIntent?: () => void;
    onBackRedirect?: () => void;
    onEngagementDrop?: () => void;
  }) => {
    interventionCallbacks.current = callbacks;
  }, []);

  const resetStepTracking = useCallback(() => {
    stepStartTime.current = Date.now();
    setPersonalization(prev => ({
      ...prev,
      userBehavior: {
        ...prev.userBehavior,
        timeOnStep: 0,
        emotionalState: 'engaged'
      }
    }));
  }, []);

  const triggerHapticFeedback = useCallback((pattern: 'light' | 'medium' | 'heavy' = 'light') => {
    if ('vibrate' in navigator) {
      const patterns = {
        light: [50],
        medium: [100],
        heavy: [200, 100, 200]
      };
      navigator.vibrate(patterns[pattern]);
    }
  }, []);

  return {
    personalization,
    setInterventionCallbacks,
    resetStepTracking,
    trackClickHesitation,
    triggerHapticFeedback
  };
}