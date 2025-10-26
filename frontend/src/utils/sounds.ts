class SoundManager {
  private audioContext: AudioContext | null = null;

  async init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('🔊 Sound system initialized');
    } catch (error) {
      console.warn('Sound system failed to initialize:', error);
    }
  }

  isInitialized(): boolean {
    return this.audioContext !== null;
  }

  play(soundName: string) {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      if (soundName === 'pour') {
        oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(150, this.audioContext.currentTime + 0.3);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.4);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.4);
      } else if (soundName === 'select') {
        oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
      } else if (soundName === 'victory') {
        oscillator.frequency.setValueAtTime(523, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.15, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 1);
      } else {
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
      }
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }
}

export const soundManager = new SoundManager();
