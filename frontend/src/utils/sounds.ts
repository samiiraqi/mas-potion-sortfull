class SoundManager {
  private audioContext: AudioContext | null = null;
  private sounds: { [key: string]: AudioBuffer } = {};

  async init() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      console.log('🔊 Enhanced sound system initialized');
      
      // Generate beautiful pour sounds
      await this.generateSounds();
    } catch (error) {
      console.warn('Sound system failed to initialize:', error);
    }
  }

  private async generateSounds() {
    if (!this.audioContext) return;

    // Create beautiful liquid pour sound with harmonics
    this.sounds.pour = this.createLiquidPourSound();
    this.sounds.select = this.createSelectSound();
    this.sounds.victory = this.createVictorySound();
    this.sounds.hint = this.createHintSound();
    this.sounds.click = this.createClickSound();
  }

  private createLiquidPourSound(): AudioBuffer {
    const ctx = this.audioContext!;
    const duration = 0.8;
    const sampleRate = ctx.sampleRate;
    const buffer = ctx.createBuffer(2, duration * sampleRate, sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < data.length; i++) {
        const t = i / sampleRate;
        
        // Create liquid-like sound with multiple frequency components
        const bubbleFreq = 200 + Math.sin(t * 15) * 50; // Bubbling effect
        const flowFreq = 80 + Math.sin(t * 8) * 20;     // Flow sound
        const sparkleFreq = 800 + Math.sin(t * 25) * 200; // High sparkle
        
        // Combine frequencies with different envelopes
        const bubble = Math.sin(2 * Math.PI * bubbleFreq * t) * Math.exp(-t * 3);
        const flow = Math.sin(2 * Math.PI * flowFreq * t) * Math.exp(-t * 2);
        const sparkle = Math.sin(2 * Math.PI * sparkleFreq * t) * Math.exp(-t * 5) * 0.3;
        
        // Add filtered noise for realistic liquid texture
        const noise = (Math.random() - 0.5) * 0.1 * Math.exp(-t * 4);
        
        // Combine all elements
        data[i] = (bubble * 0.4 + flow * 0.4 + sparkle * 0.3 + noise) * 0.6;
      }
    }
    
    return buffer;
  }

  private createSelectSound(): AudioBuffer {
    const ctx = this.audioContext!;
    const duration = 0.3;
    const buffer = ctx.createBuffer(2, duration * ctx.sampleRate, ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const freq = 800 + t * 400; // Rising tone
        const envelope = Math.exp(-t * 8);
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.3;
      }
    }
    
    return buffer;
  }

  private createVictorySound(): AudioBuffer {
    const ctx = this.audioContext!;
    const duration = 2.0;
    const buffer = ctx.createBuffer(2, duration * ctx.sampleRate, ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        
        // Triumphant chord progression
        const note1 = Math.sin(2 * Math.PI * 523 * t); // C5
        const note2 = Math.sin(2 * Math.PI * 659 * t); // E5  
        const note3 = Math.sin(2 * Math.PI * 784 * t); // G5
        
        const envelope = Math.exp(-t * 0.8);
        data[i] = (note1 + note2 + note3) * envelope * 0.2;
      }
    }
    
    return buffer;
  }

  private createHintSound(): AudioBuffer {
    const ctx = this.audioContext!;
    const duration = 0.5;
    const buffer = ctx.createBuffer(2, duration * ctx.sampleRate, ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const freq = 600 + Math.sin(t * 10) * 100; // Gentle warble
        const envelope = Math.exp(-t * 2);
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.25;
      }
    }
    
    return buffer;
  }

  private createClickSound(): AudioBuffer {
    const ctx = this.audioContext!;
    const duration = 0.15;
    const buffer = ctx.createBuffer(2, duration * ctx.sampleRate, ctx.sampleRate);

    for (let channel = 0; channel < 2; channel++) {
      const data = buffer.getChannelData(channel);
      
      for (let i = 0; i < data.length; i++) {
        const t = i / ctx.sampleRate;
        const freq = 1200;
        const envelope = Math.exp(-t * 20);
        data[i] = Math.sin(2 * Math.PI * freq * t) * envelope * 0.2;
      }
    }
    
    return buffer;
  }

  play(soundName: string) {
    if (!this.audioContext || !this.sounds[soundName]) return;

    try {
      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = this.sounds[soundName];
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      // Add subtle reverb for depth
      gainNode.gain.setValueAtTime(0.8, this.audioContext.currentTime);
      
      source.start();
    } catch (error) {
      console.warn('Failed to play sound:', error);
    }
  }
}

export const soundManager = new SoundManager();
