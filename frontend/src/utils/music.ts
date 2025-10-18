class MusicManager {
  private audio: HTMLAudioElement | null = null;
  private enabled: boolean = true;
  private volume: number = 0.3;

  constructor() {
    // Create simple background ambience using Web Audio API
    this.createAmbience();
  }

  private createAmbience() {
    // We'll use a simple looping tone for now
    // You can replace with actual MP3 later
  }

  playBackgroundMusic() {
    if (!this.enabled) return;
    
    // For now, just a placeholder
    // Add your music.mp3 to public/music/ folder
    try {
      if (!this.audio) {
        this.audio = new Audio('/music/background.mp3');
        this.audio.loop = true;
        this.audio.volume = this.volume;
      }
      this.audio.play().catch(() => {
        console.log('Music autoplay blocked - will play on user interaction');
      });
    } catch (e) {
      console.log('Background music not available');
    }
  }

  stopMusic() {
    if (this.audio) {
      this.audio.pause();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.playBackgroundMusic();
    } else {
      this.stopMusic();
    }
    return this.enabled;
  }

  setVolume(vol: number) {
    this.volume = vol;
    if (this.audio) {
      this.audio.volume = vol;
    }
  }

  isEnabled() {
    return this.enabled;
  }
}

export const musicManager = new MusicManager();
