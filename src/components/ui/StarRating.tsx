import React from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  filled: number;
  total: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StarRating({ filled, total, size = 'md' }: StarRatingProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8'
  };

  return (
    <div className="flex items-center justify-center space-x-1">
      {Array.from({ length: total }, (_, index) => (
        <Star
          key={index}
          className={`${sizeClasses[size]} transition-all duration-500 ${
            index < filled
              ? 'text-yellow-500 fill-yellow-500 drop-shadow-lg'
              : 'text-gray-300 fill-gray-300'
          }`}
          style={{
            animationDelay: `${index * 100}ms`,
            filter: index < filled ? 'drop-shadow(0 0 8px rgba(234, 179, 8, 0.6))' : 'none'
          }}
        />
      ))}
    </div>
  );
}