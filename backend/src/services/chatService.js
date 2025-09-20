import axios from 'axios';

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

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

export const chatService = {
    getChatbotResponse,
};