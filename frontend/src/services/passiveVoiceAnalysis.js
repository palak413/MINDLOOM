// Passive Voice Analysis Service
// This service runs in the background to detect mood patterns from voice without explicit recording

export class PassiveVoiceAnalysis {
  constructor() {
    this.isListening = false;
    this.audioContext = null;
    this.analyser = null;
    this.microphone = null;
    this.dataArray = null;
    this.moodDetector = null;
    this.analysisInterval = null;
    this.voiceHistory = [];
    this.isUserConsented = false;
  }

  // Initialize passive voice analysis
  async initialize() {
    try {
      // Request microphone permission
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false
        } 
      });
      
      this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      this.analyser = this.audioContext.createAnalyser();
      this.microphone = this.audioContext.createMediaStreamSource(stream);
      
      this.analyser.fftSize = 2048;
      this.microphone.connect(this.analyser);
      
      this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
      this.isUserConsented = true;
      
      console.log('Passive voice analysis initialized');
      return true;
    } catch (error) {
      console.log('Microphone access denied or not available:', error);
      return false;
    }
  }

  // Start passive monitoring
  startPassiveMonitoring() {
    if (!this.isUserConsented || this.isListening) return;
    
    this.isListening = true;
    this.analysisInterval = setInterval(() => {
      this.analyzeVoicePattern();
    }, 5000); // Analyze every 5 seconds
    
    console.log('Passive voice monitoring started');
  }

  // Stop passive monitoring
  stopPassiveMonitoring() {
    if (!this.isListening) return;
    
    this.isListening = false;
    if (this.analysisInterval) {
      clearInterval(this.analysisInterval);
      this.analysisInterval = null;
    }
    
    console.log('Passive voice monitoring stopped');
  }

  // Analyze voice patterns passively
  analyzeVoicePattern() {
    if (!this.analyser || !this.dataArray) return;
    
    this.analyser.getByteFrequencyData(this.dataArray);
    
    // Extract voice features
    const features = this.extractVoiceFeatures();
    
    // Only analyze if there's significant voice activity
    if (features.voiceActivity > 0.1) {
      const moodData = this.detectMoodFromVoice(features);
      this.voiceHistory.push({
        timestamp: Date.now(),
        features,
        mood: moodData
      });
      
      // Keep only last 10 analyses
      if (this.voiceHistory.length > 10) {
        this.voiceHistory.shift();
      }
      
      // Emit mood change event
      this.emitMoodChange(moodData);
    }
  }

  // Extract voice features from audio data
  extractVoiceFeatures() {
    const data = this.dataArray;
    const features = {
      voiceActivity: 0,
      pitch: 0,
      energy: 0,
      spectralCentroid: 0,
      zeroCrossingRate: 0
    };

    // Calculate voice activity (simplified)
    let sum = 0;
    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }
    features.voiceActivity = sum / (data.length * 255);

    // Calculate pitch (simplified - find dominant frequency)
    let maxIndex = 0;
    let maxValue = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] > maxValue) {
        maxValue = data[i];
        maxIndex = i;
      }
    }
    features.pitch = (maxIndex * this.audioContext.sampleRate) / (2 * data.length);

    // Calculate energy
    let energySum = 0;
    for (let i = 0; i < data.length; i++) {
      energySum += data[i] * data[i];
    }
    features.energy = Math.sqrt(energySum / data.length) / 255;

    // Calculate spectral centroid
    let weightedSum = 0;
    let magnitudeSum = 0;
    for (let i = 0; i < data.length; i++) {
      weightedSum += i * data[i];
      magnitudeSum += data[i];
    }
    features.spectralCentroid = magnitudeSum > 0 ? weightedSum / magnitudeSum : 0;

    return features;
  }

  // Detect mood from voice features
  detectMoodFromVoice(features) {
    const { voiceActivity, pitch, energy, spectralCentroid } = features;
    
    // Low energy + low pitch = potentially sad/depressed
    if (energy < 0.3 && pitch < 200) {
      return {
        mood: 'low',
        confidence: 0.7,
        triggers: ['low_energy', 'low_pitch'],
        severity: 'moderate'
      };
    }
    
    // High energy + high pitch + high spectral centroid = potentially anxious
    if (energy > 0.7 && pitch > 300 && spectralCentroid > 0.6) {
      return {
        mood: 'anxious',
        confidence: 0.6,
        triggers: ['high_energy', 'high_pitch'],
        severity: 'moderate'
      };
    }
    
    // Very low voice activity = potentially withdrawn
    if (voiceActivity < 0.05) {
      return {
        mood: 'withdrawn',
        confidence: 0.5,
        triggers: ['low_voice_activity'],
        severity: 'mild'
      };
    }
    
    // Normal patterns
    return {
      mood: 'neutral',
      confidence: 0.4,
      triggers: [],
      severity: 'none'
    };
  }

  // Emit mood change event
  emitMoodChange(moodData) {
    const event = new CustomEvent('moodChange', {
      detail: {
        mood: moodData.mood,
        confidence: moodData.confidence,
        triggers: moodData.triggers,
        severity: moodData.severity,
        timestamp: Date.now()
      }
    });
    
    window.dispatchEvent(event);
  }

  // Get mood trend from voice history
  getMoodTrend() {
    if (this.voiceHistory.length < 3) return null;
    
    const recentMoods = this.voiceHistory.slice(-5).map(entry => entry.mood.mood);
    const moodCounts = {};
    
    recentMoods.forEach(mood => {
      moodCounts[mood] = (moodCounts[mood] || 0) + 1;
    });
    
    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
      moodCounts[a] > moodCounts[b] ? a : b
    );
    
    return {
      dominantMood,
      trend: this.calculateTrend(recentMoods),
      confidence: Math.max(...recentMoods.map(mood => 
        this.voiceHistory.find(entry => entry.mood.mood === mood)?.mood.confidence || 0
      ))
    };
  }

  // Calculate mood trend
  calculateTrend(moods) {
    const moodValues = {
      'low': 1,
      'withdrawn': 2,
      'neutral': 3,
      'anxious': 4
    };
    
    const values = moods.map(mood => moodValues[mood] || 3);
    const trend = values[values.length - 1] - values[0];
    
    if (trend > 0.5) return 'improving';
    if (trend < -0.5) return 'declining';
    return 'stable';
  }

  // Cleanup
  cleanup() {
    this.stopPassiveMonitoring();
    
    if (this.microphone) {
      this.microphone.disconnect();
    }
    
    if (this.audioContext) {
      this.audioContext.close();
    }
    
    this.isListening = false;
    this.isUserConsented = false;
  }
}

export default PassiveVoiceAnalysis;
