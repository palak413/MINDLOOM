// src/controllers/journal.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Journal } from "../models/journalModel.js";
import { aiService } from "../services/aiservice.js";
import { gamificationService } from "../services/gamificationservice.js";









// This is an example for your Node.js backend code

// AFTER (Correct ES Module syntax):
import axios from 'axios';

// The URL where your Python Flask API is running
const ML_API_URL = 'http://127.0.0.1:5001/predict';

/**
 * Sends text to the Python ML service and returns the prediction.
 * @param {string} journalText The text to analyze.
 * @returns {Promise<object>} The prediction data from the API.
 */
async function getDistortionPrediction(journalText) {
  console.log('Sending text to ML API for analysis...');
  try {
    // Send a POST request with the text in the JSON body
    const response = await axios.post(ML_API_URL, {
      text: journalText
    });

    // The prediction data from the Flask API
    const predictionData = response.data;
    console.log('Prediction received:', predictionData);
    
    // Return the data (e.g., { predicted_distortion: '...', confidence_score: 0.99 })
    return predictionData;

  } catch (error) {
    // This block runs if the Python server is down or returns an error
    console.error('Error calling ML API:', error.message);
    return { error: 'Analysis service is currently unavailable.' };
  }
}


// --- Example of how you might use this in one of your Express routes ---
/*
app.post('/api/journal-entries', async (req, res) => {
  const { entryText } = req.body;

  // 1. Call the ML service to get the prediction
  const prediction = await getDistortionPrediction(entryText);

  // 2. Save the journal entry and the prediction to your database
  // ... your database logic here ...

  // 3. Send a success response back to the frontend
  res.status(201).json({ 
    message: "Journal entry saved.", 
    analysis: prediction 
  });
});
*/


// --- You can uncomment this for a quick standalone test ---
/*
async function test() {
  const sampleText = "I made one small mistake, so the whole project is completely ruined.";
  const result = await getDistortionPrediction(sampleText);
  console.log('Final Result:', result);
}
test();
*/

const createJournalEntry = asyncHandler(async (req, res) => {
    const { content } = req.body;
    
    // Use AI to analyze the mood of the entry before saving
    const detectedMood = await aiService.analyzeJournalMood(content);

    const entry = await Journal.create({
        user: req.user._id,
        content,
        mood: detectedMood,
    });

    await gamificationService.addPointsAndCheckBadges({ userId: req.user._id, points: 10 });
    await gamificationService.updateUserStreak(req.user._id);
    
    return res.status(201).json(new apiResponse(201, entry, "Journal entry created successfully"));
});

const getUserEntries = asyncHandler(async (req, res) => {
    const entries = await Journal.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new apiResponse(200, entries, "Journal entries retrieved successfully"));
});

export { createJournalEntry, getUserEntries };