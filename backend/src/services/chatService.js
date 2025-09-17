import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Gets a conversational response from the AI chatbot.
 * @param {string} userMessage - The new message from the user.
 * @param {Array<object>} chatHistory - An array of previous messages for context. E.g., [{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Hello!' }]
 * @returns {Promise<string>} The AI's generated response.
 */
const getChatbotResponse = async (userMessage, chatHistory = []) => {
    try {
        const messages = [
            {
                role: "system",
                content: "You are Aura, a friendly and supportive wellness assistant. Your goal is to listen, provide encouragement, and offer gentle guidance. Keep your responses concise and caring."
            },
            ...chatHistory, // Include the past conversation
            {
                role: "user",
                content: userMessage
            }
        ];

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
            temperature: 0.7, // A bit more creative than analysis
            max_tokens: 150,
        });

        return response.choices[0].message.content.trim();

    } catch (error) {
        console.error("Error communicating with OpenAI for chat:", error);
        return "I'm sorry, I'm having a little trouble connecting right now. Please try again in a moment.";
    }
};

export const chatService = {
    getChatbotResponse,
};