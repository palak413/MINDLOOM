import axios from 'axios';

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// AI Model API configuration
const AI_MODEL_API_URL = process.env.AI_MODEL_API_URL || 'http://localhost:5001';
const AI_MODEL_ENABLED = process.env.AI_MODEL_ENABLED === 'true';

/**
 * Gets a conversational response from the AI chatbot using Gemini API.
 * @param {string} userMessage - The new message from the user.
 * @param {Array<object>} chatHistory - An array of previous messages for context. E.g., [{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Hello!' }]
 * @returns {Promise<string>} The AI's generated response.
 */
const getChatbotResponse = async (userMessage, chatHistory = []) => {
    try {
        // Build conversation context
        let conversationContext = "You are Aura, a friendly and supportive wellness assistant. Your goal is to listen, provide encouragement, and offer gentle guidance. Keep your responses concise and caring.\n\n";
        
        // Add chat history
        if (chatHistory.length > 0) {
            conversationContext += "Previous conversation:\n";
            chatHistory.forEach(msg => {
                const role = msg.role === 'user' ? 'User' : 'Assistant';
                conversationContext += `${role}: ${msg.content}\n`;
            });
            conversationContext += "\n";
        }
        
        conversationContext += `User: ${userMessage}\n\nPlease respond as Aura:`;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{
                parts: [{
                    text: conversationContext
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 150,
                topP: 0.8,
                topK: 10
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 15000 // 15 second timeout
        });

        if (response.data && response.data.candidates && response.data.candidates[0]) {
            const responseText = response.data.candidates[0].content.parts[0].text.trim();
            console.log('Gemini chat response:', responseText);
            return responseText;
        } else {
            console.error('Unexpected Gemini API response structure:', response.data);
            return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
        }

    } catch (error) {
        console.error("Error communicating with Gemini for chat:", error.response?.data || error.message);
        return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
    }
};

/**
 * Gets an enhanced AI assistant response with mood awareness
 * @param {string} userMessage - The user's message
 * @param {object} context - Context including mood, personality, etc.
 * @returns {Promise<object>} Enhanced AI response with mood insights
 */
const getAIAssistantResponse = async (userMessage, context = {}) => {
    try {
        const { userMood, moodHistory, personality, conversationHistory, voiceInput } = context;
        
        // Build enhanced context for mood-aware responses
        let conversationContext = `You are Aura, an advanced AI wellness assistant with emotional intelligence. You can detect and respond to user emotions through voice analysis and conversation patterns.

User's Current Mood: ${userMood || 'neutral'}
Emotional Stability: ${personality?.emotionalStability || 'unknown'}
Dominant Mood Pattern: ${personality?.dominantMood || 'neutral'}

Recent Mood History: ${moodHistory?.map(m => `${m.emotion} (${Math.round(m.confidence * 100)}%)`).join(', ') || 'none'}

You should:
1. Acknowledge their emotional state
2. Provide mood-appropriate responses
3. Offer helpful suggestions based on their mood
4. Be empathetic and supportive
5. Keep responses conversational and natural

`;

        // Add conversation history for context
        if (conversationHistory && conversationHistory.length > 0) {
            conversationContext += "\nRecent conversation:\n";
            conversationHistory.slice(-5).forEach(msg => {
                conversationContext += `${msg.user ? 'User' : 'Assistant'}: ${msg.user || msg.assistant}\n`;
            });
            conversationContext += "\n";
        }

        // Add voice input context
        if (voiceInput) {
            conversationContext += `Note: This message came from voice input, and I detected the emotion "${userMood}". Respond naturally to their voice.\n\n`;
        }

        conversationContext += `User: ${userMessage}\n\nPlease respond as Aura with emotional intelligence:`;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{
                parts: [{
                    text: conversationContext
                }]
            }],
            generationConfig: {
                temperature: 0.8,
                maxOutputTokens: 200,
                topP: 0.9,
                topK: 15
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 15000
        });

        if (response.data && response.data.candidates && response.data.candidates[0]) {
            const responseText = response.data.candidates[0].content.parts[0].text.trim();
            
            // Generate mood-appropriate suggestions
            const suggestions = generateMoodSuggestions(userMood, personality);
            
            // Generate mood insights
            const moodInsights = generateMoodInsights(userMood, moodHistory, personality);
            
            return {
                message: responseText,
                suggestions,
                moodInsights,
                timestamp: new Date().toISOString()
            };
        } else {
            throw new Error('Invalid response from AI');
        }

    } catch (error) {
        console.error("Error in AI Assistant response:", error.response?.data || error.message);
        return {
            message: "I'm having trouble processing that right now, but I'm still here to help. Could you try again?",
            suggestions: ["How are you feeling today?", "Would you like to talk about something?", "Let's try a different approach."],
            moodInsights: null,
            timestamp: new Date().toISOString()
        };
    }
};

/**
 * Analyzes voice with AI model integration
 * @param {object} audioData - Audio data for analysis
 * @param {object} context - Additional context
 * @returns {Promise<object>} Voice analysis results
 */
const analyzeVoiceWithAI = async (audioData, context = {}) => {
    try {
        if (!AI_MODEL_ENABLED) {
            return {
                success: false,
                error: 'AI model not enabled',
                fallback: 'neutral'
            };
        }

        // Call the AI model API
        const response = await axios.post(`${AI_MODEL_API_URL}/predict`, audioData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            timeout: 10000
        });

        if (response.data.success) {
            const { emotion, confidence, probabilities } = response.data;
            
            return {
                success: true,
                emotion,
                confidence,
                probabilities,
                timestamp: new Date().toISOString(),
                model: 'ultra_simple_ai'
            };
        } else {
            throw new Error(response.data.message || 'Voice analysis failed');
        }

    } catch (error) {
        console.error('Voice analysis error:', error.message);
        return {
            success: false,
            error: error.message,
            fallback: 'neutral',
            timestamp: new Date().toISOString()
        };
    }
};

/**
 * Generate mood-appropriate suggestions
 */
const generateMoodSuggestions = (mood, personality) => {
    const suggestions = {
        happy: [
            "Share what's making you feel great!",
            "Let's capture this positive energy in your journal",
            "Would you like to set a goal while you're feeling motivated?"
        ],
        sad: [
            "Would you like to talk about what's bothering you?",
            "Let's try some gentle breathing exercises",
            "How about we check on your plant together?"
        ],
        angry: [
            "Let's work through this frustration together",
            "Would you like to try some calming exercises?",
            "Let's find a healthy way to express these feelings"
        ],
        fear: [
            "You're safe here. What's causing you concern?",
            "Let's take some deep breaths together",
            "Would you like to talk through your worries?"
        ],
        surprise: [
            "Tell me more about what surprised you!",
            "Let's capture this moment in your journal",
            "How are you feeling about this unexpected event?"
        ],
        disgust: [
            "What's not sitting right with you?",
            "Let's talk through what's bothering you",
            "Would you like to explore these feelings?"
        ],
        neutral: [
            "How are you feeling today?",
            "What's on your mind?",
            "Would you like to check in with your wellness goals?"
        ]
    };

    return suggestions[mood] || suggestions.neutral;
};

/**
 * Generate mood insights based on current mood and history
 */
const generateMoodInsights = (currentMood, moodHistory, personality) => {
    if (!moodHistory || moodHistory.length === 0) {
        return null;
    }

    const recentMoods = moodHistory.slice(-5);
    const moodCounts = {};
    
    recentMoods.forEach(entry => {
        moodCounts[entry.emotion] = (moodCounts[entry.emotion] || 0) + 1;
    });

    const dominantMood = Object.keys(moodCounts).reduce((a, b) => 
        moodCounts[a] > moodCounts[b] ? a : b
    );

    return {
        emotion: currentMood,
        dominantPattern: dominantMood,
        emotionalStability: personality?.emotionalStability || 'unknown',
        trend: currentMood === dominantMood ? 'consistent' : 'changing',
        recommendation: getMoodRecommendation(currentMood)
    };
};

/**
 * Get mood-based recommendations
 */
const getMoodRecommendation = (mood) => {
    const recommendations = {
        happy: "Great to see you feeling positive! Consider journaling about what's bringing you joy.",
        sad: "It's okay to feel sad. Consider gentle activities like breathing exercises or talking to someone.",
        angry: "Anger is a valid emotion. Try some physical activity or deep breathing to help process it.",
        fear: "Anxiety can be overwhelming. Try grounding techniques or talking through your concerns.",
        surprise: "Unexpected events can be exciting or challenging. Take time to process your feelings.",
        disgust: "Discomfort is a signal. Consider what might be causing this feeling and address it gently.",
        neutral: "A calm state is wonderful. Use this time for reflection or planning."
    };

    return recommendations[mood] || recommendations.neutral;
};

export const chatService = {
    getChatbotResponse,
    getAIAssistantResponse,
    analyzeVoiceWithAI,
};