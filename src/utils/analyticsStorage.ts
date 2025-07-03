import { AnalyticsData, LeadData, StepAnalytics } from '../types/analytics';

const ANALYTICS_KEY = 'divine_quiz_analytics';
const LEADS_KEY = 'divine_quiz_leads';

export class AnalyticsStorage {
  static saveLeadData(leadData: LeadData): void {
    try {
      const existing = this.getLeads();
      const updated = [...existing, leadData];
      localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
      this.updateStepAnalytics();
    } catch (error) {
      console.error('Error saving lead data:', error);
    }
  }

  static updateLeadStep(leadId: string, stepData: Partial<LeadData>): void {
    try {
      const leads = this.getLeads();
      const leadIndex = leads.findIndex(l => l.id === leadId);
      
      if (leadIndex !== -1) {
        leads[leadIndex] = { ...leads[leadIndex], ...stepData };
        localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
        this.updateStepAnalytics();
      }
    } catch (error) {
      console.error('Error updating lead step:', error);
    }
  }

  static getLeads(): LeadData[] {
    try {
      const stored = localStorage.getItem(LEADS_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error loading leads:', error);
      return [];
    }
  }

  static getAnalytics(): AnalyticsData {
    try {
      const stored = localStorage.getItem(ANALYTICS_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
      return this.generateAnalytics();
    } catch (error) {
      console.error('Error loading analytics:', error);
      return this.generateAnalytics();
    }
  }

  private static updateStepAnalytics(): void {
    const analytics = this.generateAnalytics();
    localStorage.setItem(ANALYTICS_KEY, JSON.stringify(analytics));
  }

  private static generateAnalytics(): AnalyticsData {
    const leads = this.getLeads();
    const stepNames = [
      'landing', 'birthdate', 'color-selection', 'name-capture', 
      'favorite-number', 'destiny-wheel', 'processing-code', 'code-reveal',
      'quiz', 'block-feedback', 'processing-final', 'diagnosis', 
      'liberation-ritual', 'wall-breaking', 'offer'
    ];

    const stepAnalytics: StepAnalytics[] = stepNames.map((stepName, index) => {
      const stepNumber = index + 1;
      const visitsToStep = leads.filter(l => 
        this.getStepNumber(l.currentStep) >= stepNumber
      ).length;
      
      const completionsFromStep = leads.filter(l => 
        this.getStepNumber(l.currentStep) > stepNumber
      ).length;
      
      const abandonmentsAtStep = leads.filter(l => 
        l.currentStep === stepName && l.abandoned
      ).length;

      const avgTime = this.calculateAverageTime(leads, stepName);
      const responses = this.getStepResponses(leads, stepName);

      return {
        stepName,
        stepNumber,
        totalVisits: visitsToStep,
        completions: completionsFromStep,
        abandonments: abandonmentsAtStep,
        conversionRate: visitsToStep > 0 ? (completionsFromStep / visitsToStep) * 100 : 0,
        abandonmentRate: visitsToStep > 0 ? (abandonmentsAtStep / visitsToStep) * 100 : 0,
        averageTimeSpent: avgTime,
        responses
      };
    });

    const totalLeads = leads.length;
    const completedFunnels = leads.filter(l => l.completed).length;
    const overallConversionRate = totalLeads > 0 ? (completedFunnels / totalLeads) * 100 : 0;

    return {
      totalLeads,
      completedFunnels,
      overallConversionRate,
      stepAnalytics,
      leadData: leads,
      lastUpdated: new Date().toISOString()
    };
  }

  private static getStepNumber(stepName: string): number {
    const stepOrder = [
      'landing', 'birthdate', 'color-selection', 'name-capture', 
      'favorite-number', 'destiny-wheel', 'processing-code', 'code-reveal',
      'quiz', 'block-feedback', 'processing-final', 'diagnosis', 
      'liberation-ritual', 'wall-breaking', 'offer'
    ];
    return stepOrder.indexOf(stepName) + 1;
  }

  private static calculateAverageTime(leads: LeadData[], stepName: string): number {
    const stepLeads = leads.filter(l => l.currentStep === stepName);
    if (stepLeads.length === 0) return 0;
    
    const totalTime = stepLeads.reduce((sum, lead) => sum + lead.timeOnStep, 0);
    return Math.round(totalTime / stepLeads.length);
  }

  private static getStepResponses(leads: LeadData[], stepName: string): Record<string, number> {
    const responses: Record<string, number> = {};
    
    leads.forEach(lead => {
      Object.entries(lead.responses).forEach(([key, value]) => {
        if (typeof value === 'string') {
          responses[value] = (responses[value] || 0) + 1;
        }
      });
    });

    return responses;
  }

  static exportAnalytics(): string {
    const analytics = this.getAnalytics();
    return JSON.stringify(analytics, null, 2);
  }

  static clearAnalytics(): void {
    localStorage.removeItem(ANALYTICS_KEY);
    localStorage.removeItem(LEADS_KEY);
  }
}