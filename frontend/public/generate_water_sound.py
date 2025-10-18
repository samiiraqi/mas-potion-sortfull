import numpy as np
import wave
import struct

# Generate realistic water pouring sound
sample_rate = 44100
duration = 0.5

# Create water-like noise
t = np.linspace(0, duration, int(sample_rate * duration))
# Brown noise (low frequency rumble like water)
brown = np.cumsum(np.random.randn(len(t)))
brown = brown / np.max(np.abs(brown))
# Band-pass filter effect
frequency = 400 + 200 * np.sin(2 * np.pi * 3 * t)
water_sound = brown * np.sin(2 * np.pi * frequency * t)
# Envelope
envelope = np.exp(-t * 2)
water_sound = water_sound * envelope * 0.5

# Convert to 16-bit PCM
audio_data = (water_sound * 32767).astype(np.int16)

# Save as WAV file
with wave.open('water-pour.wav', 'w') as wav_file:
    wav_file.setnchannels(1)
    wav_file.setsampwidth(2)
    wav_file.setframerate(sample_rate)
    wav_file.writeframes(audio_data.tobytes())

print("✅ Water sound created!")
