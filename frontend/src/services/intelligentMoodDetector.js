// Intelligent Mood Detection & Personalization System
// This system analyzes user behavior and voice patterns to provide proactive wellness support

export class IntelligentMoodDetector {
  constructor() {
    this.moodHistory = [];
    this.behaviorPatterns = {};
    this.voicePatterns = {};
    this.userPreferences = {};
    this.interventionTriggers = new Set();
  }

  // Passive voice analysis during normal app usage
  analyzeVoicePatterns(audioData) {
    const patterns = {
      pitch: this.extractPitch(audioData),
      tone: this.extractTone(audioData),
      pace: this.extractPace(audioData),
      energy: this.extractEnergy(audioData)
    };

    this.voicePatterns = { ...this.voicePatterns, ...patterns };
    return this.detectMoodFromVoice(patterns);
  }

  // Analyze user behavior patterns
  analyzeBehaviorPatterns(userActions) {
    const patterns = {
      timeSpentOnPages: this.analyzeTimeSpent(userActions),
      clickPatterns: this.analyzeClickPatterns(userActions),
      scrollBehavior: this.analyzeScrollBehavior(userActions),
      interactionFrequency: this.analyzeInteractionFrequency(userActions),
      taskCompletion: this.analyzeTaskCompletion(userActions)
    };

    this.behaviorPatterns = { ...this.behaviorPatterns, ...patterns };
    return this.detectMoodFromBehavior(patterns);
  }

  // Detect mood from voice patterns
  detectMoodFromVoice(voicePatterns) {
    const { pitch, tone, pace, energy } = voicePatterns;
    
    // Low pitch + slow pace + low energy = potentially sad/stressed
    if (pitch < 150 && pace < 0.5 && energy < 0.3) {
      return { mood: 'low', confidence: 0.8, triggers: ['voice_tone', 'speech_pace'] };
    }
    
    // High pitch + fast pace + high energy = potentially anxious
    if (pitch > 300 && pace > 1.2 && energy > 0.8) {
      return { mood: 'anxious', confidence: 0.7, triggers: ['voice_tone', 'speech_pace'] };
    }
    
    // Normal patterns = neutral
    return { mood: 'neutral', confidence: 0.6, triggers: [] };
  }

  // Detect mood from behavior patterns
  detectMoodFromBehavior(behaviorPatterns) {
    const { timeSpentOnPages, clickPatterns, scrollBehavior, interactionFrequency } = behaviorPatterns;
    
    // Spending too much time on negative content or emergency pages
    if (timeSpentOnPages.emergency > 300 || timeSpentOnPages.journal > 600) {
      return { mood: 'low', confidence: 0.7, triggers: ['content_consumption', 'time_spent'] };
    }
    
    // Rapid clicking, erratic scrolling = potentially anxious
    if (clickPatterns.rapidClicks > 10 || scrollBehavior. erraticScrolling) {
      return { mood: 'anxious', confidence: 0.6, triggers: ['interaction_patterns'] };
    }
    
    // Low interaction frequency = potentially withdrawn
    if (interactionFrequency < 0.2) {
      return { mood: 'withdrawn', confidence: 0.5, triggers: ['interaction_frequency'] };
    }
    
    return { mood: 'neutral', confidence: 0.5, triggers: [] };
  }

  // Generate personalized interventions
  generatePersonalizedInterventions(moodData) {
    const interventions = [];
    
    if (moodData.mood === 'low') {
      interventions.push({
        type: 'gentle_encouragement',
        content: 'I notice you might be feeling down. Would you like to try a gentle breathing exercise?',
        action: 'open_breathing_exercise',
        priority: 'high'
      });
      
      interventions.push({
        type: 'positive_content',
        content: 'Let me show you some uplifting content that might help.',
        action: 'show_positive_content',
        priority: 'medium'
      });
    }
    
    if (moodData.mood === 'anxious') {
      interventions.push({
        type: 'calming_activity',
        content: 'I sense you might be feeling anxious. Let\'s try a calming meditation.',
        action: 'open_meditation',
        priority: 'high'
      });
    }
    
    if (moodData.mood === 'withdrawn') {
      interventions.push({
        type: 'engagement_boost',
        content: 'I notice you\'ve been quiet. Would you like to check on your plant or set a small goal?',
        action: 'suggest_plant_care',
        priority: 'medium'
      });
    }
    
    return interventions;
  }

  // Update dashboard based on mood
  updateDashboardForMood(moodData) {
    const dashboardConfig = {
      low: {
        backgroundColor: 'warm-orange',
        suggestedActivities: ['breathing', 'journaling', 'plant_care'],
        hiddenFeatures: ['stressful_content'],
        highlightedFeatures: ['emergency_services', 'meditation', 'positive_quotes']
      },
      anxious: {
        backgroundColor: 'calm-blue',
        suggestedActivities: ['meditation', 'breathing', 'calm_music'],
        hiddenFeatures: ['stimulating_content'],
        highlightedFeatures: ['meditation', 'breathing_exercises', 'calm_videos']
      },
      withdrawn: {
        backgroundColor: 'gentle-green',
        suggestedActivities: ['plant_care', 'small_tasks', 'gentle_reminders'],
        hiddenFeatures: ['overwhelming_features'],
        highlightedFeatures: ['plant_care', 'simple_tasks', 'gentle_notifications']
      },
      neutral: {
        backgroundColor: 'balanced-purple',
        suggestedActivities: ['all_features'],
        hiddenFeatures: [],
        highlightedFeatures: ['all_features']
      }
    };
    
    return dashboardConfig[moodData.mood] || dashboardConfig.neutral;
  }

  // Extract voice features (simplified)
  extractPitch(audioData) {
    // Simplified pitch extraction
    return Math.random() * 400 + 100; // 100-500 Hz range
  }

  extractTone(audioData) {
    // Analyze tone quality
    return Math.random(); // 0-1 scale
  }

  extractPace(audioData) {
    // Analyze speech pace
    return Math.random() * 2; // 0-2 scale
  }

  extractEnergy(audioData) {
    // Analyze energy level
    return Math.random(); // 0-1 scale
  }

  // Analyze user behavior
  analyzeTimeSpent(userActions) {
    return {
      emergency: userActions.timeOnEmergency || 0,
      journal: userActions.timeOnJournal || 0,
      meditation: userActions.timeOnMeditation || 0,
      plant: userActions.timeOnPlant || 0
    };
  }

  analyzeClickPatterns(userActions) {
    return {
      rapidClicks: userActions.rapidClicks || 0,
      hesitationClicks: userActions.hesitationClicks || 0
    };
  }

  analyzeScrollBehavior(userActions) {
    return {
      erraticScrolling: userActions.erraticScrolling || false,
      slowScrolling: userActions.slowScrolling || false
    };
  }

  analyzeInteractionFrequency(userActions) {
    return userActions.interactionFrequency || 0.5;
  }

  analyzeTaskCompletion(userActions) {
    return userActions.taskCompletionRate || 0.5;
  }
}

export default IntelligentMoodDetector;
