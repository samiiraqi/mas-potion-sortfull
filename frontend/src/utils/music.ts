class MusicManager {
  private audio: HTMLAudioElement | null = null;
  private enabled: boolean = true;
  private initialized: boolean = false;
  private musicAvailable: boolean = false; // Flag to check if music exists

  constructor() {
    this.enabled = localStorage.getItem('music_enabled') !== 'false';
    // Don't try to load music by default
    this.musicAvailable = false;
  }

  private async checkMusicAvailable(): Promise<boolean> {
    try {
      const response = await fetch('/music/background.mp3', { method: 'HEAD' });
      return response.ok;
    } catch {
      return false;
    }
  }

  private async initAudio() {
    if (this.initialized) return;
    
    // Check if music file exists first
    this.musicAvailable = await this.checkMusicAvailable();
    
    if (!this.musicAvailable) {
      console.log('Background music not available - game will run without music');
      return;
    }
    
    try {
      this.audio = new Audio('/music/background.mp3');
      this.audio.loop = true;
      this.audio.volume = 0.3;
      this.initialized = true;
    } catch (err) {
      console.warn('Failed to initialize music');
      this.initialized = false;
    }
  }

  async playBackgroundMusic() {
    if (!this.enabled) return;
    
    await this.initAudio();
    
    if (this.audio && this.musicAvailable) {
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
