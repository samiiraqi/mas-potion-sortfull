class SoundManager {
  private audioContext: AudioContext | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }
      
      this.initialized = true;
      console.log('🔊 Gentle sound system initialized');
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

    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }

    try {
      if (soundName === 'pour') {
        this.playGentlePour();
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

  private playGentlePour() {
    const ctx = this.audioContext!;
    
    // Create very gentle water drop sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Soft sine wave
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(220, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(110, ctx.currentTime + 0.3);
    
    // Heavy filtering for smoothness
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(500, ctx.currentTime);
    filter.Q.setValueAtTime(0.5, ctx.currentTime);
    
    // Very gentle volume
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02);
    gainNode.gain.linearRampToValueAtTime(0.03, ctx.currentTime + 0.2);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  }

  private playSelectSound() {
    const ctx = this.audioContext!;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(440, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.03, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }

  private playVictorySound() {
    const ctx = this.audioContext!;
    
    [261, 329, 392].forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      
      gainNode.gain.setValueAtTime(0.02, ctx.currentTime + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
      
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + 0.8);
    });
  }

  private playClickSound() {
    const ctx = this.audioContext!;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.02, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.05);
  }
}

export const soundManager = new SoundManager();
