import { useEffect, useRef } from 'react';

export function useBackgroundAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const isInitialized = useRef(false);

  useEffect(() => {
    // Só inicializar uma vez
    if (isInitialized.current) return;
    
    const initializeAudio = () => {
      try {
        // URL do som de root chakra (396 Hz - frequência de cura)
        // Usando um gerador de tom online ou arquivo de chakra
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        // Configurar frequência do root chakra (396 Hz)
        oscillator.frequency.setValueAtTime(396, audioContext.currentTime);
        oscillator.type = 'sine';
        
        // Volume muito baixo (10%)
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        
        // Conectar nós
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        // Iniciar o som
        oscillator.start();
        
        // Manter referência para cleanup
        audioRef.current = { 
          context: audioContext, 
          oscillator, 
          gainNode 
        } as any;
        
        isInitialized.current = true;
        
        console.log('🎵 Root Chakra sound initialized at 396Hz, 10% volume');
        
      } catch (error) {
        console.warn('Audio context not supported:', error);
        
        // Fallback: tentar com arquivo de áudio se Web Audio API não funcionar
        try {
          const audio = new Audio();
          // URL de um arquivo de root chakra de 396Hz (você pode hospedar ou usar um CDN)
          audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT';
          audio.volume = 0.1;
          audio.loop = true;
          audio.play().catch(() => {
            // Silenciosamente falhar se não conseguir tocar
          });
          
          audioRef.current = audio;
          isInitialized.current = true;
          
        } catch (fallbackError) {
          console.warn('Fallback audio also failed:', fallbackError);
        }
      }
    };

    // Tentar inicializar imediatamente
    initializeAudio();
    
    // Também tentar após primeira interação do usuário (para contornar políticas de autoplay)
    const handleFirstInteraction = () => {
      if (!isInitialized.current) {
        initializeAudio();
      }
      // Remover listeners após primeira interação
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('touchstart', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });

    // Cleanup
    return () => {
      if (audioRef.current) {
        try {
          if (audioRef.current.context) {
            // Web Audio API cleanup
            audioRef.current.oscillator?.stop();
            audioRef.current.context?.close();
          } else if (audioRef.current.pause) {
            // HTML Audio cleanup
            audioRef.current.pause();
            audioRef.current.src = '';
          }
        } catch (error) {
          console.warn('Error cleaning up audio:', error);
        }
      }
      
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('touchstart', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
    };
  }, []);

  return null; // Não retorna nada - é invisível para o usuário
}