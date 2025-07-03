import { useEffect, useRef } from 'react';
import { AnalyticsStorage } from '../utils/analyticsStorage';
import { LeadData } from '../types/analytics';
import { QuizStep } from '../types';

export function useAnalytics() {
  const leadId = useRef<string>(`lead-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`);
  const stepStartTime = useRef<number>(Date.now());
  const currentStepRef = useRef<QuizStep>('landing');

  const trackStepEntry = (step: QuizStep, responses: Record<string, any> = {}) => {
    const now = Date.now();
    const timeOnPreviousStep = now - stepStartTime.current;

    // Update previous step data
    if (currentStepRef.current !== step) {
      AnalyticsStorage.updateLeadStep(leadId.current, {
        currentStep: step,
        stepNumber: getStepNumber(step),
        timeOnStep: timeOnPreviousStep,
        responses,
        abandoned: false,
        timestamp: new Date().toISOString()
      });

      // Track Facebook Pixel page view
      if (typeof window !== 'undefined' && (window as any).fbq) {
        (window as any).fbq('track', 'PageView', {
          content_name: `Step: ${step}`,
          content_category: 'Divine Quiz',
          step_name: step,
          step_number: getStepNumber(step),
          lead_id: leadId.current
        });

        // Track custom step progression event
        (window as any).fbq('trackCustom', 'StepProgression', {
          step_name: step,
          step_number: getStepNumber(step),
          time_on_previous_step: timeOnPreviousStep,
          lead_id: leadId.current,
          responses: Object.keys(responses).length
        });
      }
    }

    currentStepRef.current = step;
    stepStartTime.current = now;
  };

  const trackStepAbandonment = () => {
    const timeOnStep = Date.now() - stepStartTime.current;
    
    AnalyticsStorage.updateLeadStep(leadId.current, {
      timeOnStep,
      abandoned: true,
      timestamp: new Date().toISOString()
    });

    // Track Facebook Pixel abandonment
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('trackCustom', 'StepAbandonment', {
        step_name: currentStepRef.current,
        step_number: getStepNumber(currentStepRef.current),
        time_on_step: timeOnStep,
        lead_id: leadId.current
      });
    }
  };

  const trackCompletion = () => {
    const timeOnStep = Date.now() - stepStartTime.current;
    
    AnalyticsStorage.updateLeadStep(leadId.current, {
      timeOnStep,
      completed: true,
      conversionStep: 'offer',
      timestamp: new Date().toISOString()
    });

    // Track Facebook Pixel completion
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'CompleteRegistration', {
        content_name: 'Divine Quiz Completion',
        content_category: 'Lead Generation',
        lead_id: leadId.current,
        total_time: Date.now() - stepStartTime.current
      });

      (window as any).fbq('trackCustom', 'QuizCompletion', {
        lead_id: leadId.current,
        completion_time: new Date().toISOString(),
        total_steps: 15
      });
    }
  };

  const trackConversion = (conversionType: string, data: Record<string, any> = {}) => {
    // Track conversion event
    AnalyticsStorage.updateLeadStep(leadId.current, {
      conversionStep: conversionType,
      conversionData: data,
      timestamp: new Date().toISOString()
    });

    // Track Facebook Pixel conversion
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Purchase', {
        content_name: 'Divine Activation Plan',
        content_category: 'Spiritual Product',
        value: 9.00,
        currency: 'USD',
        lead_id: leadId.current,
        conversion_type: conversionType,
        ...data
      });

      (window as any).fbq('trackCustom', 'DivineConversion', {
        conversion_type: conversionType,
        lead_id: leadId.current,
        conversion_data: data,
        timestamp: new Date().toISOString()
      });
    }
  };

  const initializeLead = () => {
    const leadData: LeadData = {
      id: leadId.current,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      currentStep: 'landing',
      stepNumber: 1,
      timeOnStep: 0,
      responses: {},
      abandoned: false,
      completed: false
    };

    AnalyticsStorage.saveLeadData(leadData);

    // Track Facebook Pixel lead initialization
    if (typeof window !== 'undefined' && (window as any).fbq) {
      (window as any).fbq('track', 'Lead', {
        content_name: 'Divine Quiz Start',
        content_category: 'Lead Generation',
        lead_id: leadId.current,
        user_agent: navigator.userAgent
      });

      (window as any).fbq('trackCustom', 'QuizStart', {
        lead_id: leadId.current,
        start_time: new Date().toISOString(),
        user_agent: navigator.userAgent
      });
    }
  };

  // Initialize lead on mount
  useEffect(() => {
    initializeLead();

    // Track abandonment on page unload
    const handleBeforeUnload = () => {
      trackStepAbandonment();
    };

    // Track visibility change (mobile app switching, etc.)
    const handleVisibilityChange = () => {
      if (document.hidden) {
        trackStepAbandonment();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return {
    trackStepEntry,
    trackStepAbandonment,
    trackCompletion,
    trackConversion,
    leadId: leadId.current
  };
}

function getStepNumber(step: QuizStep): number {
  const stepOrder: QuizStep[] = [
    'landing', 'birthdate', 'color-selection', 'name-capture', 
    'favorite-number', 'destiny-wheel', 'processing-code', 'code-reveal',
    'quiz', 'block-transition', 'processing-final', 'diagnosis', 
    'liberation-ritual', 'wall-breaking', 'offer'
  ];
  return stepOrder.indexOf(step) + 1;
}