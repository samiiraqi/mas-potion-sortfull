class SoundManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private enabled: boolean = true;
  private initialized: boolean = false;

  private initSounds() {
    if (this.initialized) return;
    
    console.log("Initializing sounds...");
    
    try {
      this.sounds.pour = new Audio("/sounds/pour.mp3");
      this.sounds.success = new Audio("/sounds/success.mp3");
      this.sounds.click = new Audio("/sounds/click.mp3");
      this.sounds.select = new Audio("/sounds/select.mp3");

      // Adjusted volumes for better quality
      this.sounds.pour.volume = 0.3;      // Lower pour volume
      this.sounds.success.volume = 0.5;   // Lower success volume
      this.sounds.click.volume = 0.5;     // Click
      this.sounds.select.volume = 0.4;    // Select
      
      Object.values(this.sounds).forEach(sound => {
        sound.load();
      });
      
      this.initialized = true;
      console.log("Sounds initialized!");
    } catch (error) {
      console.error("Sound init failed:", error);
    }
  }

  play(soundName: string) {
    if (!this.initialized) {
      this.initSounds();
    }
    
    if (!this.enabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(err => console.error("Play failed:", err));
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
