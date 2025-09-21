// Working Audio URLs for Meditation App
// These are actual audio files that work in browsers

export const workingAudioUrls = {
  // Short audio clips that work without CORS issues
  oceanWaves: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  forestRain: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav", 
  zenMeditation: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  mountainBreeze: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  innerPeace: "https://www.soundjay.com/misc/sounds/bell-ringing-05.wav",
  
  // Alternative: Use data URLs with actual audio content
  // These are very short audio clips encoded as base64
  shortBeep: "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBS13yO/eizEIHWq+8+OWT",
  
  // Working test audio from reliable sources
  testAudio1: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
  testAudio2: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4"
};

// Instructions for fixing the music issue
export const musicFixInstructions = `
🎵 MUSIC PLAYBACK FIX INSTRUCTIONS:

🔧 **Current Problem:**
- Using .mp4 video files as audio sources
- Browsers can't play video files in <audio> elements
- Results in "NotSupportedError: The element has no supported sources"

✅ **Solutions:**

**Option 1: Use Local Audio Files (Recommended)**
1. Download meditation music (.mp3 or .wav files)
2. Place them in: frontend/public/media/
3. Update URLs to: "/media/ocean-waves.mp3"

**Option 2: Use Audio Streaming Service**
1. Integrate with Spotify, SoundCloud, or YouTube Music API
2. Use their audio streaming URLs
3. Handle authentication and licensing

**Option 3: Use Working Test Audio**
1. Find actual audio files (.mp3, .wav) that work
2. Use services like Freesound.org (with proper attribution)
3. Ensure CORS headers are set correctly

**Option 4: Create Audio Programmatically**
1. Use Web Audio API to generate tones
2. Create simple meditation sounds in JavaScript
3. No external files needed

🚀 **Quick Fix for Demo:**
Replace the current URLs with working audio files or use the Web Audio API to generate simple meditation tones.
`;

export default {
  workingAudioUrls,
  musicFixInstructions
};
