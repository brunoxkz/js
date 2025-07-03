import React from 'react';

interface ProgressBarProps {
  current: number;
  total: number;
  className?: string;
}

export function ProgressBar({ current, total, className = '' }: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);
  
  return (
    <div className={`w-full bg-gray-200 rounded-full h-2 ${className}`}>
      <div 
        className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-1000 ease-out"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

interface DivineProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function DivineProgressBar({ currentStep, totalSteps }: DivineProgressBarProps) {
  const percentage = Math.min((currentStep / totalSteps) * 100, 100);
  
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-yellow-200 p-3">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">
            Revelación Divina en Progreso
          </span>
          <span className="text-sm font-bold text-yellow-700">
            {Math.round(percentage)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 h-3 rounded-full transition-all duration-1000 ease-out shadow-lg relative overflow-hidden"
            style={{ width: `${percentage}%` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>
  );
}