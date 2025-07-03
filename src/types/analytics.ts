export interface StepAnalytics {
  stepName: string;
  stepNumber: number;
  totalVisits: number;
  completions: number;
  abandonments: number;
  conversionRate: number;
  abandonmentRate: number;
  averageTimeSpent: number; // em segundos
  responses?: Record<string, number>; // para steps com respostas
}

export interface LeadData {
  id: string;
  timestamp: string;
  userAgent: string;
  ip?: string;
  currentStep: string;
  stepNumber: number;
  timeOnStep: number;
  responses: Record<string, any>;
  abandoned: boolean;
  completed: boolean;
  conversionStep?: string;
}

export interface AnalyticsData {
  totalLeads: number;
  completedFunnels: number;
  overallConversionRate: number;
  stepAnalytics: StepAnalytics[];
  leadData: LeadData[];
  lastUpdated: string;
}