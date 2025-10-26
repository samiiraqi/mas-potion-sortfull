class SoundManager {
  private audioContext: AudioContext | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    try {
      // Better mobile support
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Resume context for mobile browsers
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.initialized = true;
      console.log('🔊 Enhanced sound system initialized');
    } catch (error) {
      console.warn('Sound system failed:', error);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  async play(soundName: string) {
    if (!this.audioContext) {
      await this.init();
      return;
    }

    // Resume context if suspended (mobile fix)
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    try {
      if (soundName === 'pour') {
        this.playBeautifulPour();
      } else if (soundName === 'select') {
        this.playSelectSound();
      } else if (soundName === 'victory') {
        this.playVictorySound();
      } else {
        this.playClickSound();
      }
    } catch (error) {
      console.warn('Sound play failed:', error);
    }
  }

  private playBeautifulPour() {
    const ctx = this.audioContext!;
    
    // Create a gentle, pleasant pouring sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    // Connect audio nodes
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Beautiful liquid sound - like gentle water
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(150, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);
    
    // Soft low-pass filter for smoothness
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(800, ctx.currentTime);
    filter.Q.setValueAtTime(1, ctx.currentTime);
    
    // Gentle volume envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.1, ctx.currentTime + 0.3);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.5);
  }

  private playSelectSound() {
    const ctx = this.audioContext!;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    oscillator.frequency.linearRampToValueAtTime(800, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.15);
  }

  private playVictorySound() {
    const ctx = this.audioContext!;
    
    // Play pleasant chord
    [261, 329, 392].forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + 1.2);
    });
  }

  private playClickSound() {
    const ctx = this.audioContext!;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.08);
  }
}

export const soundManager = new SoundManager();
