class MusicManager {
  private audio: HTMLAudioElement | null = null;
  private enabled: boolean = true;
  private initialized: boolean = false;

  constructor() {
    this.enabled = localStorage.getItem('music_enabled') !== 'false';
  }

  private initAudio() {
    if (this.initialized) return;
    
    try {
      this.audio = new Audio('/music/background.mp3');
      this.audio.loop = true;
      this.audio.volume = 0.3;
      this.initialized = true;
    } catch (err) {
      console.warn('Background music not available');
      this.initialized = false;
    }
  }

  playBackgroundMusic() {
    if (!this.enabled) return;
    
    this.initAudio();
    
    if (this.audio) {
      this.audio.play().catch(err => {
        console.log('Music autoplay blocked - will play on user interaction');
      });
    }
  }

  stopBackgroundMusic() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0;
    }
  }

  toggle(): boolean {
    this.enabled = !this.enabled;
    localStorage.setItem('music_enabled', this.enabled.toString());
    
    if (this.enabled) {
      this.playBackgroundMusic();
    } else {
      this.stopBackgroundMusic();
    }
    
    return this.enabled;
  }

  isEnabled(): boolean {
    return this.enabled;
  }
}

export const musicManager = new MusicManager();
