class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;

  constructor() {
    // Initialize sounds with simple frequencies
    this.initSounds();
  }

  private initSounds() {
    // We'll use Web Audio API for simple sounds
    console.log('🔊 Sound system initialized');
  }

  private playTone(frequency: number, duration: number) {
    if (!this.enabled) return;

    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (error) {
      console.log('Sound error:', error);
    }
  }

  play(soundName: string) {
    switch(soundName) {
      case 'click':
        this.playTone(800, 0.1);
        break;
      case 'select':
        this.playTone(600, 0.15);
        break;
      case 'pour':
        this.playTone(400, 0.3);
        break;
      case 'success':
        // Victory chime
        setTimeout(() => this.playTone(523, 0.15), 0);
        setTimeout(() => this.playTone(659, 0.15), 150);
        setTimeout(() => this.playTone(784, 0.3), 300);
        break;
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }
}

export const soundManager = new SoundManager();
