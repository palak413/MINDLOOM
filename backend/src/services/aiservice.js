// src/services/ai.service.js
import { OpenAI } from "openai";

// Initialize the OpenAI client once
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Analyzes journal content to determine its primary mood using OpenAI.
 * @param {string} journalContent - The text from the user's journal entry.
 * @returns {Promise<string>} A one or two-word summary of the mood (e.g., 'Hopeful', 'Anxious').
 */
const analyzeJournalMood = async (journalContent) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    role: "system",
                    content: "You are an expert at analyzing text for emotional sentiment. Analyze the following journal entry and respond with only one or two words that best describe the primary emotion (e.g., 'Anxious', 'Hopeful', 'Reflective'). Do not add any extra text or punctuation."
                },
                {
                    role: "user",
                    content: journalContent
                }
            ],
            temperature: 0.2,
            max_tokens: 10,
        });

        const mood = response.choices[0].message.content.trim();
        return mood;
    } catch (error) {
        console.error("Error analyzing journal mood with OpenAI:", error);
        // Return a neutral default value in case of an API error
        return "Reflective";
    }
};


export const aiService = {
    analyzeJournalMood,
};