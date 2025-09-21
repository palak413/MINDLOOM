import api from './api';

const EmergencyAPI = {
  // Get all emergency contacts
  getEmergencyContacts: async () => {
    try {
      const response = await api.get('/api/v1/emergency/contacts');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching emergency contacts:', error);
      throw error;
    }
  },

  // Get emergency contacts by type
  getEmergencyContactsByType: async (type) => {
    try {
      const response = await api.get(`/api/v1/emergency/contacts/type/${type}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching emergency contacts by type:', error);
      throw error;
    }
  },

  // Get high priority emergency contacts
  getHighPriorityContacts: async () => {
    try {
      const response = await api.get('/api/v1/emergency/contacts/high-priority');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching high priority contacts:', error);
      throw error;
    }
  },

  // Detect emergency in message or voice
  detectEmergency: async (message, voiceData = null) => {
    try {
      const response = await api.post('/api/v1/emergency/detect', {
        message,
        voiceData
      });
      return response.data.data;
    } catch (error) {
      console.error('Error detecting emergency:', error);
      throw error;
    }
  },

  // Create safety plan
  createSafetyPlan: async (planData) => {
    try {
      const response = await api.post('/api/v1/emergency/safety-plan', {
        userId: localStorage.getItem('userId'), // Get from auth store in real implementation
        planData
      });
      return response.data.data;
    } catch (error) {
      console.error('Error creating safety plan:', error);
      throw error;
    }
  },

  // Emergency detection keywords (client-side)
  emergencyKeywords: [
    'suicide', 'kill myself', 'end it all', 'not worth living', 'want to die',
    'hurt myself', 'self harm', 'cut myself', 'overdose', 'crisis',
    'emergency', 'help me', 'can\'t take it', 'give up', 'hopeless',
    'desperate', 'crisis', 'urgent', 'immediate help'
  ],

  // Check if message contains emergency keywords
  checkForEmergency: (message) => {
    if (!message) return { isEmergency: false, keywords: [] };
    
    const messageLower = message.toLowerCase();
    const detectedKeywords = EmergencyAPI.emergencyKeywords.filter(keyword => 
      messageLower.includes(keyword)
    );
    
    return {
      isEmergency: detectedKeywords.length > 0,
      keywords: detectedKeywords,
      confidence: Math.min(detectedKeywords.length * 0.2, 1)
    };
  },

  // Get emergency response suggestions
  getEmergencySuggestions: () => {
    return [
      'Call 988 (Suicide Prevention Lifeline)',
      'Text HOME to 741741 (Crisis Text Line)',
      'Contact a trusted friend or family member',
      'Go to the nearest emergency room',
      'Call 911 if in immediate danger'
    ];
  }
};

export default EmergencyAPI;
