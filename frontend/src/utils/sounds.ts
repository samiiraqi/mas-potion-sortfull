class SoundManager {
  private initialized = false;

  async init() {
    if (this.initialized) return;
    this.initialized = true;
    console.log('🔊 Simple audio system ready');
  }

  isInitialized(): boolean {
    return this.initialized;
  }

  play(soundName: string) {
    // For now, just console log instead of making bad sounds
    console.log(`🔊 Playing: ${soundName}`);
    
    // You could add actual audio files here later:
    // const audio = new Audio('/sounds/pour.mp3');
    // audio.play();
  }
}

export const soundManager = new SoundManager();
