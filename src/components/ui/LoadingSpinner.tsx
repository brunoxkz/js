import React from 'react';

interface LoadingSpinnerProps {
  text: string;
  subtext?: string;
}

export function LoadingSpinner({ text, subtext }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 md:space-y-6">
      <div className="relative">
        <div className="w-12 h-12 md:w-16 md:h-16 border-3 md:border-4 border-yellow-200 border-t-yellow-600 rounded-full animate-spin"></div>
        <div className="absolute inset-0 w-12 h-12 md:w-16 md:h-16 border-3 md:border-4 border-transparent border-r-yellow-400 rounded-full animate-spin" style={{ animationDelay: '150ms' }}></div>
      </div>
      
      <div className="text-center">
        <h3 className="text-lg md:text-xl font-semibold text-white mb-2">{text}</h3>
        {subtext && (
          <p className="text-white/80 text-sm md:text-base">{subtext}</p>
        )}
      </div>
    </div>
  );
}