class SoundManager {
  private audioContext: AudioContext | null = null;
  private initialized = false;

  async init() {
    if (this.initialized) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.initialized = true;
      console.log('🔊 Sound system initialized');
    } catch (error) {
      console.warn('Sound system failed:', error);
    }
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  play(soundName: string) {
    if (!this.audioContext) {
      this.init(); // Try to initialize if not ready
      return;
    }

    try {
      if (soundName === 'pour') {
        this.playPourSound();
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

  private playPourSound() {
    const ctx = this.audioContext!;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    // Beautiful liquid pour frequency
    oscillator.frequency.setValueAtTime(200, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.5);
    
    // Smooth volume envelope
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.1);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.6);
  }

  private playSelectSound() {
    const ctx = this.audioContext!;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.2);
  }

  private playVictorySound() {
    const ctx = this.audioContext!;
    
    [523, 659, 784].forEach((freq, i) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime);
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.5);
      
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + 1.5);
    });
  }

  private playClickSound() {
    const ctx = this.audioContext!;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(1200, ctx.currentTime);
    gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }
}

export const soundManager = new SoundManager();
