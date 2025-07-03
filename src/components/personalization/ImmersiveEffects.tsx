import React, { useEffect, useRef, useState } from 'react';

interface ImmersiveEffectsProps {
  personalizedContent: {
    urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
    colorScheme: 'warm' | 'cool' | 'energetic' | 'calming';
    animationIntensity: 'subtle' | 'moderate' | 'intense';
  };
  emotionalState: 'excited' | 'hesitant' | 'confused' | 'engaged' | 'leaving';
  children: React.ReactNode;
}

export function ImmersiveEffects({ personalizedContent, emotionalState, children }: ImmersiveEffectsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    color: string;
  }>>([]);

  // Adaptive background based on emotional state
  const getBackgroundGradient = () => {
    const baseGradients = {
      warm: 'from-amber-50 via-orange-50 to-red-50',
      cool: 'from-blue-50 via-indigo-50 to-purple-50',
      energetic: 'from-yellow-50 via-orange-50 to-red-50',
      calming: 'from-green-50 via-blue-50 to-indigo-50'
    };

    const intensityModifiers = {
      excited: 'brightness-110 saturate-110',
      hesitant: 'brightness-95 saturate-90',
      confused: 'brightness-90 saturate-80',
      engaged: 'brightness-100 saturate-100',
      leaving: 'brightness-120 saturate-120 contrast-110'
    };

    return `bg-gradient-to-br ${baseGradients[personalizedContent.colorScheme]} ${intensityModifiers[emotionalState]}`;
  };

  // Adaptive animations based on urgency and emotional state
  const getContainerAnimations = () => {
    const animations = [];

    if (personalizedContent.urgencyLevel === 'critical') {
      animations.push('animate-pulse');
    }

    if (emotionalState === 'leaving' && personalizedContent.animationIntensity === 'intense') {
      animations.push('animate-bounce');
    }

    if (emotionalState === 'excited') {
      animations.push('animate-fade-in');
    }

    return animations.join(' ');
  };

  // Particle system for visual feedback
  useEffect(() => {
    if (personalizedContent.animationIntensity === 'subtle') return;

    const createParticle = (x: number, y: number) => {
      const colors = {
        warm: ['#f59e0b', '#ef4444', '#f97316'],
        cool: ['#3b82f6', '#6366f1', '#8b5cf6'],
        energetic: ['#eab308', '#f59e0b', '#ef4444'],
        calming: ['#10b981', '#3b82f6', '#6366f1']
      };

      return {
        id: Math.random(),
        x,
        y,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        life: 1,
        color: colors[personalizedContent.colorScheme][Math.floor(Math.random() * 3)]
      };
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (personalizedContent.animationIntensity === 'intense' && emotionalState === 'excited') {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          setParticles(prev => [...prev, createParticle(x, y)].slice(-20));
        }
      }
    };

    const animateParticles = () => {
      setParticles(prev => 
        prev
          .map(particle => ({
            ...particle,
            x: particle.x + particle.vx,
            y: particle.y + particle.vy,
            life: particle.life - 0.02
          }))
          .filter(particle => particle.life > 0)
      );
    };

    const interval = setInterval(animateParticles, 16); // 60fps
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      clearInterval(interval);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, [personalizedContent, emotionalState]);

  // Adaptive sound effects (if supported)
  const playAdaptiveSound = (type: 'success' | 'warning' | 'info') => {
    if ('AudioContext' in window) {
      const audioContext = new AudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      const frequencies = {
        success: 523.25, // C5
        warning: 440,    // A4
        info: 329.63     // E4
      };

      oscillator.frequency.setValueAtTime(frequencies[type], audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    }
  };

  // Trigger sound effects based on emotional state changes
  useEffect(() => {
    switch (emotionalState) {
      case 'excited':
        playAdaptiveSound('success');
        break;
      case 'leaving':
        playAdaptiveSound('warning');
        break;
      case 'confused':
        playAdaptiveSound('info');
        break;
    }
  }, [emotionalState]);

  // Adaptive cursor effects
  const getCursorStyle = () => {
    switch (emotionalState) {
      case 'excited':
        return 'cursor-pointer';
      case 'hesitant':
        return 'cursor-help';
      case 'confused':
        return 'cursor-crosshair';
      case 'leaving':
        return 'cursor-not-allowed';
      default:
        return 'cursor-default';
    }
  };

  return (
    <div
      ref={containerRef}
      className={`min-h-screen transition-all duration-1000 ${getBackgroundGradient()} ${getContainerAnimations()} ${getCursorStyle()} relative overflow-hidden`}
    >
      {/* Particle overlay */}
      {particles.length > 0 && (
        <div className="absolute inset-0 pointer-events-none z-10">
          {particles.map(particle => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 rounded-full animate-ping"
              style={{
                left: particle.x,
                top: particle.y,
                backgroundColor: particle.color,
                opacity: particle.life,
                transform: `scale(${particle.life})`
              }}
            />
          ))}
        </div>
      )}

      {/* Adaptive overlay effects */}
      {personalizedContent.urgencyLevel === 'critical' && (
        <div className="absolute inset-0 pointer-events-none z-5">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-red-100/20 to-transparent animate-pulse" />
        </div>
      )}

      {emotionalState === 'leaving' && (
        <div className="absolute inset-0 pointer-events-none z-5">
          <div className="absolute inset-0 bg-gradient-to-t from-red-100/30 to-transparent animate-pulse" />
        </div>
      )}

      {/* Content with adaptive styling */}
      <div className={`relative z-20 ${
        personalizedContent.animationIntensity === 'intense' ? 'transform transition-transform duration-300 hover:scale-[1.02]' : ''
      }`}>
        {children}
      </div>

      {/* Ambient light effects */}
      {personalizedContent.animationIntensity !== 'subtle' && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div 
            className={`absolute top-1/4 left-1/4 w-96 h-96 rounded-full opacity-10 animate-pulse ${
              personalizedContent.colorScheme === 'warm' ? 'bg-orange-400' :
              personalizedContent.colorScheme === 'energetic' ? 'bg-yellow-400' :
              personalizedContent.colorScheme === 'cool' ? 'bg-blue-400' :
              'bg-green-400'
            }`}
            style={{
              filter: 'blur(100px)',
              animationDuration: emotionalState === 'excited' ? '2s' : '4s'
            }}
          />
          <div 
            className={`absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full opacity-10 animate-pulse ${
              personalizedContent.colorScheme === 'warm' ? 'bg-red-400' :
              personalizedContent.colorScheme === 'energetic' ? 'bg-orange-400' :
              personalizedContent.colorScheme === 'cool' ? 'bg-purple-400' :
              'bg-blue-400'
            }`}
            style={{
              filter: 'blur(80px)',
              animationDuration: emotionalState === 'excited' ? '3s' : '5s',
              animationDelay: '1s'
            }}
          />
        </div>
      )}
    </div>
  );
}