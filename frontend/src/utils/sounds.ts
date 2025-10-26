class SoundManager {
  private audioContext: AudioContext | null = null;
  private unlocked = false;

  async init() {
    console.log('Sound system ready for user interaction');
  }

  isInitialized(): boolean {
    return this.unlocked;
  }

  async unlock() {
    if (this.unlocked) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.01);
      
      this.unlocked = true;
      console.log('Audio unlocked');
    } catch (error) {
      console.warn('Audio unlock failed:', error);
    }
  }

  async play(soundName: string) {
    if (!this.unlocked) {
      await this.unlock();
    }
    
    if (!this.audioContext) return;

    try {
      if (soundName === 'pour') {
        this.playNicePourSound();
      } else if (soundName === 'select') {
        this.playNiceSelectSound();
      } else {
        this.playNiceClickSound();
      }
    } catch (error) {
      console.warn('Sound play failed:', error);
    }
  }

  private playNicePourSound() {
    const ctx = this.audioContext!;
    
    // Create gentle water drop sound
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();
    
    oscillator.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(130, ctx.currentTime); // Much lower, gentler frequency
    oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);
    
    // Soft filter
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(300, ctx.currentTime);
    
    // Very gentle volume
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.02, ctx.currentTime + 0.05);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.4);
  }

  private playNiceSelectSound() {
    const ctx = this.audioContext!;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(220, ctx.currentTime); // Musical note A3
    
    gainNode.gain.setValueAtTime(0.015, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.15);
  }

  private playNiceClickSound() {
    const ctx = this.audioContext!;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(330, ctx.currentTime); // Musical note E4
    
    gainNode.gain.setValueAtTime(0.01, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    
    oscillator.start();
    oscillator.stop(ctx.currentTime + 0.08);
  }
}

export const soundManager = new SoundManager();
