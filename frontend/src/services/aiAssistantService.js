// src/services/aiAssistantService.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const AI_MODEL_API_URL = import.meta.env.VITE_AI_MODEL_API_URL || 'http://localhost:5001';

class AIAssistantService {
  constructor() {
    this.conversationHistory = [];
    this.userMoodProfile = {
      currentMood: 'neutral',
      moodHistory: [],
      preferences: {},
      personality: {}
    };
    this.isListening = false;
    this.mediaRecorder = null;
    this.audioChunks = [];
  }

  // Voice Analysis Methods
  async analyzeVoiceEmotion(audioBlob) {
    try {
      console.log('🎤 Analyzing voice emotion...');
      
      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice_recording.wav');

      const response = await axios.post(`${AI_MODEL_API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 10000,
      });

      if (response.data.success) {
        const { emotion, confidence, probabilities } = response.data;
        
        // Update user mood profile
        this.updateMoodProfile(emotion, confidence);
        
        return {
          success: true,
          emotion,
          confidence,
          probabilities,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(response.data.message || 'Voice analysis failed');
      }
    } catch (error) {
      console.error('Voice analysis error:', error);
      return {
        success: false,
        error: error.message,
        fallback: 'neutral'
      };
    }
  }

  // Mood Profile Management
  updateMoodProfile(emotion, confidence) {
    this.userMoodProfile.currentMood = emotion;
    this.userMoodProfile.moodHistory.push({
      emotion,
      confidence,
      timestamp: new Date().toISOString()
    });

    // Keep only last 50 mood entries
    if (this.userMoodProfile.moodHistory.length > 50) {
      this.userMoodProfile.moodHistory = this.userMoodProfile.moodHistory.slice(-50);
    }

    // Update personality insights
    this.updatePersonalityInsights();
  }

  updatePersonalityInsights() {
    const recentMoods = this.userMoodProfile.moodHistory.slice(-10);
    const moodCounts = {};
    
    recentMoods.forEach(entry => {
      moodCounts[entry.emotion] = (moodCounts[entry.emotion] || 0) + 1;
    });

    // Determine dominant personality traits
    this.userMoodProfile.personality = {
      dominantMood: Object.keys(moodCounts).reduce((a, b) => moodCounts[a] > moodCounts[b] ? a : b),
      moodVariability: Object.keys(moodCounts).length,
      emotionalStability: this.calculateEmotionalStability(),
      lastUpdated: new Date().toISOString()
    };
  }

  calculateEmotionalStability() {
    const recentMoods = this.userMoodProfile.moodHistory.slice(-10);
    if (recentMoods.length < 3) return 'unknown';
    
    const moodChanges = recentMoods.slice(1).filter((entry, index) => 
      entry.emotion !== recentMoods[index].emotion
    ).length;
    
    const stabilityScore = 1 - (moodChanges / recentMoods.length);
    
    if (stabilityScore > 0.7) return 'stable';
    if (stabilityScore > 0.4) return 'moderate';
    return 'variable';
  }

  // Intelligent Chat Methods
  async sendMessage(message, context = {}) {
    try {
      console.log('💬 Sending message to AI assistant...');
      
      // Prepare context with mood information
      const enhancedContext = {
        ...context,
        userMood: this.userMoodProfile.currentMood,
        moodHistory: this.userMoodProfile.moodHistory.slice(-5),
        personality: this.userMoodProfile.personality,
        conversationHistory: this.conversationHistory.slice(-10)
      };

      const response = await axios.post(`${API_BASE_URL}/api/v1/chat/send`, {
        message,
        context: enhancedContext,
        timestamp: new Date().toISOString()
      });

      if (response.data.success) {
        const aiResponse = response.data.data;
        
        // Add to conversation history
        this.conversationHistory.push({
          user: message,
          assistant: aiResponse.message,
          timestamp: new Date().toISOString(),
          mood: this.userMoodProfile.currentMood,
          context: enhancedContext
        });

        // Keep conversation history manageable
        if (this.conversationHistory.length > 100) {
          this.conversationHistory = this.conversationHistory.slice(-100);
        }

        return {
          success: true,
          message: aiResponse.message,
          suggestions: aiResponse.suggestions || [],
          moodInsights: aiResponse.moodInsights || null,
          timestamp: new Date().toISOString()
        };
      } else {
        throw new Error(response.data.message || 'Chat failed');
      }
    } catch (error) {
      console.error('Chat error:', error);
      return {
        success: false,
        error: error.message,
        fallback: this.getFallbackResponse(message)
      };
    }
  }

  // Voice Command Recognition
  async processVoiceCommand(audioBlob) {
    try {
      // First analyze emotion
      const emotionResult = await this.analyzeVoiceEmotion(audioBlob);
      
      // Then convert speech to text (you can integrate with speech-to-text API)
      const transcription = await this.transcribeAudio(audioBlob);
      
      if (transcription.success) {
        const command = this.parseVoiceCommand(transcription.text);
        
        return {
          success: true,
          command,
          transcription: transcription.text,
          emotion: emotionResult.emotion,
          confidence: emotionResult.confidence,
          timestamp: new Date().toISOString()
        };
      } else {
        return {
          success: false,
          error: 'Speech recognition failed',
          emotion: emotionResult.emotion
        };
      }
    } catch (error) {
      console.error('Voice command processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Speech-to-Text (placeholder - integrate with actual STT service)
  async transcribeAudio(audioBlob) {
    try {
      // This is a placeholder - integrate with actual speech-to-text service
      // For now, return a mock transcription
      return {
        success: true,
        text: "Hello, how are you feeling today?",
        confidence: 0.85
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Voice Command Parsing
  parseVoiceCommand(text) {
    const lowerText = text.toLowerCase();
    
    // Mood-related commands
    if (lowerText.includes('how am i feeling') || lowerText.includes('my mood')) {
      return {
        type: 'mood_check',
        action: 'get_current_mood',
        parameters: {}
      };
    }
    
    // Journal commands
    if (lowerText.includes('journal') || lowerText.includes('write')) {
      return {
        type: 'journal',
        action: 'open_journal',
        parameters: { mood: this.userMoodProfile.currentMood }
      };
    }
    
    // Plant care commands
    if (lowerText.includes('plant') || lowerText.includes('water')) {
      return {
        type: 'plant_care',
        action: 'check_plant_status',
        parameters: {}
      };
    }
    
    // Meditation commands
    if (lowerText.includes('meditate') || lowerText.includes('breathing')) {
      return {
        type: 'meditation',
        action: 'start_session',
        parameters: { mood: this.userMoodProfile.currentMood }
      };
    }
    
    // General chat
    return {
      type: 'chat',
      action: 'send_message',
      parameters: { message: text, mood: this.userMoodProfile.currentMood }
    };
  }

  // Mood-Aware Response Generation
  generateMoodAwareResponse(message, emotion) {
    const moodResponses = {
      happy: [
        "I can hear the joy in your voice! That's wonderful!",
        "Your happiness is contagious! Tell me more about what's making you feel great.",
        "I love hearing you so upbeat! What's bringing you this joy?"
      ],
      sad: [
        "I can sense some sadness in your voice. I'm here to listen and help.",
        "It sounds like you're going through a tough time. Would you like to talk about it?",
        "I'm here for you. Sometimes talking about what's bothering us can help."
      ],
      angry: [
        "I can hear the frustration in your voice. Let's work through this together.",
        "It sounds like something is really bothering you. What's on your mind?",
        "I understand you're feeling upset. Let's find a way to address this."
      ],
      fear: [
        "I can sense some anxiety in your voice. You're safe here, and I'm here to help.",
        "It sounds like you're feeling worried about something. Let's talk through it.",
        "I'm here to support you through whatever is causing you concern."
      ],
      surprise: [
        "Wow! I can hear the surprise in your voice! What happened?",
        "Something unexpected must have happened! I'd love to hear about it.",
        "Your voice is full of wonder! Tell me what surprised you."
      ],
      disgust: [
        "I can hear some frustration in your voice. What's bothering you?",
        "It sounds like something isn't sitting right with you. Let's talk about it.",
        "I can sense some discomfort. What would you like to discuss?"
      ],
      neutral: [
        "How are you feeling today?",
        "What's on your mind?",
        "I'm here to listen and help however I can."
      ]
    };

    const responses = moodResponses[emotion] || moodResponses.neutral;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  // Fallback Response
  getFallbackResponse(message) {
    const fallbacks = [
      "I'm having trouble processing that right now, but I'm still here to help.",
      "Let me try to understand that better. Could you rephrase?",
      "I'm experiencing some technical difficulties, but I'm listening.",
      "I want to help you, but I need a moment to process that."
    ];
    
    return fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Audio Recording Methods
  async startVoiceRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          sampleRate: 44100,
          channelCount: 1,
          latency: 0.01
        } 
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: this.getSupportedMimeType(),
        audioBitsPerSecond: 128000
      });

      this.audioChunks = [];
      this.isListening = true;

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { 
          type: this.mediaRecorder.mimeType || 'audio/webm' 
        });
        
        if (audioBlob.size > 1000) {
          this.processVoiceInput(audioBlob);
        }
        
        stream.getTracks().forEach(track => track.stop());
        this.isListening = false;
      };

      this.mediaRecorder.start(250);
      return { success: true, message: 'Recording started' };
    } catch (error) {
      console.error('Recording error:', error);
      this.isListening = false;
      return { success: false, error: error.message };
    }
  }

  stopVoiceRecording() {
    if (this.mediaRecorder && this.isListening) {
      this.mediaRecorder.stop();
      return { success: true, message: 'Recording stopped' };
    }
    return { success: false, error: 'No active recording' };
  }

  getSupportedMimeType() {
    const types = [
      'audio/webm;codecs=opus',
      'audio/webm',
      'audio/mp4',
      'audio/wav',
      'audio/ogg;codecs=opus',
      'audio/ogg'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        return type;
      }
    }
    return 'audio/webm';
  }

  async processVoiceInput(audioBlob) {
    try {
      // Analyze emotion first
      const emotionResult = await this.analyzeVoiceEmotion(audioBlob);
      
      // Generate mood-aware response
      const moodResponse = this.generateMoodAwareResponse('', emotionResult.emotion);
      
      // Send to chat for intelligent response
      const chatResult = await this.sendMessage(moodResponse, {
        voiceInput: true,
        emotion: emotionResult.emotion,
        confidence: emotionResult.confidence
      });

      return {
        success: true,
        emotion: emotionResult.emotion,
        confidence: emotionResult.confidence,
        response: chatResult.message,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('Voice input processing error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  // Utility Methods
  getMoodProfile() {
    return {
      ...this.userMoodProfile,
      conversationCount: this.conversationHistory.length,
      lastInteraction: this.conversationHistory[this.conversationHistory.length - 1]?.timestamp
    };
  }

  getConversationHistory() {
    return this.conversationHistory;
  }

  clearConversationHistory() {
    this.conversationHistory = [];
  }

  resetMoodProfile() {
    this.userMoodProfile = {
      currentMood: 'neutral',
      moodHistory: [],
      preferences: {},
      personality: {}
    };
  }
}

// Create singleton instance
const aiAssistantService = new AIAssistantService();

export default aiAssistantService;
