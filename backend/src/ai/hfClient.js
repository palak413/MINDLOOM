// src/ai/hf.client.js
import { HfInference } from '@huggingface/inference';
import { apiError } from '../utils/apiError.js';

// 1. Initialize the Hugging Face Inference client
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

/**
 * Analyzes the sentiment of a given text using a pre-trained Hugging Face model.
 * @param {string} textToAnalyze - The text to analyze (e.g., a journal entry).
 * @returns {Promise<Object>} An object containing the sentiment analysis result.
 */
export const analyzeSentimentWithHF = async (textToAnalyze) => {
  try {
    const result = await hf.textClassification({
      model: 'distilbert-base-uncased-finetuned-sst-2-english',
      inputs: textToAnalyze,
    });
    return result;
  } catch (error) {
    console.error("Error during Hugging Face sentiment analysis:", error);
    throw new apiError(500, "Failed to analyze sentiment with AI service.");
  }
};

/*
 * HOW TO USE IT IN A SERVICE:
 * import { analyzeSentimentWithHF } from '../ai/hf.client.js';
 *
 * const journalContent = "I had a wonderful and productive day!";
 * const sentiment = await analyzeSentimentWithHF(journalContent);
 * console.log(sentiment); // e.g., [{ label: 'POSITIVE', score: 0.99... }]
*/