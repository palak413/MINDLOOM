// src/ai/openai.client.js
import OpenAI from 'openai';
import { apiError } from '../utils/apiError.js';

// 1. Initialize the OpenAI client with the API key from environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * A reusable function to get a chat completion from OpenAI.
 * @param {string} prompt - The user prompt or text to analyze.
 * @param {string} systemMessage - The instruction for the AI model.
 * @returns {Promise<string>} The AI-generated text content.
 */
export const getOpenAICompletion = async (
  prompt,
  systemMessage = "You are a helpful assistant for a mental wellness app."
) => {
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Or "gpt-4" if you have access
      messages: [
        {
          role: "system",
          content: systemMessage,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    return completion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching completion from OpenAI:", error);
    throw new apiError(500, "Failed to get a response from AI service.");
  }
};

/*
 * HOW TO USE IT IN A SERVICE:
 * import { getOpenAICompletion } from '../ai/openai.client.js';
 *
 * const journalContent = "I felt really anxious today about my presentation.";
 * const analysisPrompt = `Analyze the sentiment of the following journal entry and provide a one-sentence summary: "${journalContent}"`;
 * const summary = await getOpenAICompletion(analysisPrompt);
 * console.log(summary); // e.g., "The user expressed feelings of anxiety related to a presentation."
*/