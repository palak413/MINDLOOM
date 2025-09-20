// src/services/ai.service.js
import axios from 'axios';

// Gemini API configuration
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// CBT Model API configuration
const CBT_API_URL = 'http://127.0.0.1:5001/predict';

/**
 * Analyzes journal content for cognitive distortions using CBT model
 * @param {string} journalContent - The text from the user's journal entry.
 * @returns {Promise<object>} CBT analysis results
 */
const analyzeCBTDistortions = async (journalContent) => {
    try {
        const response = await axios.post(CBT_API_URL, {
            text: journalContent
        }, {
            timeout: 10000 // 10 second timeout
        });

        if (response.data && response.data.predicted_distortion) {
            return {
                distortion: response.data.predicted_distortion,
                confidence: response.data.confidence_score,
                source: 'CBT Model'
            };
        } else {
            throw new Error('Invalid CBT model response');
        }
    } catch (error) {
        console.error('CBT analysis error:', error.message);
        return null; // Return null if CBT analysis fails
    }
};

/**
 * Analyzes journal content to determine its primary mood using Gemini API.
 * @param {string} journalContent - The text from the user's journal entry.
 * @returns {Promise<string>} A one or two-word summary of the mood (e.g., 'Hopeful', 'Anxious').
 */
const analyzeJournalMood = async (journalContent) => {
    try {
        const prompt = `You are an expert at analyzing text for emotional sentiment. Analyze the following journal entry and respond with only one or two words that best describe the primary emotion (e.g., 'Anxious', 'Hopeful', 'Reflective'). Do not add any extra text or punctuation.

Journal entry: "${journalContent}"`;

        const response = await axios.post(GEMINI_API_URL, {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 10,
                topP: 0.8,
                topK: 10
            }
        }, {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 10000 // 10 second timeout
        });

        if (response.data && response.data.candidates && response.data.candidates[0]) {
            const mood = response.data.candidates[0].content.parts[0].text.trim();
            console.log('Gemini mood analysis result:', mood);
            return mood;
        } else {
            console.error('Unexpected Gemini API response structure:', response.data);
            return "Reflective";
        }
    } catch (error) {
        console.error("Error analyzing journal mood with Gemini:", error.response?.data || error.message);
        // Return a neutral default value in case of an API error
        return "Reflective";
    }
};

/**
 * Comprehensive journal analysis combining mood and CBT distortion detection
 * @param {string} journalContent - The text from the user's journal entry.
 * @returns {Promise<object>} Combined analysis results
 */
const analyzeJournalComprehensive = async (journalContent) => {
    try {
        // Run both analyses in parallel
        const [moodResult, cbtResult] = await Promise.allSettled([
            analyzeJournalMood(journalContent),
            analyzeCBTDistortions(journalContent)
        ]);

        const mood = moodResult.status === 'fulfilled' ? moodResult.value : 'Reflective';
        const cbtAnalysis = cbtResult.status === 'fulfilled' ? cbtResult.value : null;

        return {
            mood,
            cbtAnalysis,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error('Comprehensive analysis error:', error);
        return {
            mood: 'Reflective',
            cbtAnalysis: null,
            timestamp: new Date().toISOString()
        };
    }
};

export const aiService = {
    analyzeJournalMood,
    analyzeCBTDistortions,
    analyzeJournalComprehensive,
};