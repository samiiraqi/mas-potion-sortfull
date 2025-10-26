class SoundManager {
  private audioContext: AudioContext | null = null;
  private unlocked = false;

  async init() {
    // Don't initialize until user interaction
    console.log('Sound system ready for user interaction');
  }

  isInitialized(): boolean {
    return this.unlocked;
  }

  async unlock() {
    if (this.unlocked) return;
    
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create and play silent sound to unlock audio context
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      oscillator.start();
      oscillator.stop(this.audioContext.currentTime + 0.01);
      
      this.unlocked = true;
      console.log('Audio unlocked for mobile');
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
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.type = 'sine';
      
      if (soundName === 'pour') {
        oscillator.frequency.value = 200;
        gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
      } else {
        oscillator.frequency.value = 400;
        gainNode.gain.setValueAtTime(0.03, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
      }
    } catch (error) {
      console.warn('Sound play failed:', error);
    }
  }
}

export const soundManager = new SoundManager();
