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
    
    if (!content || content.trim().length === 0) {
        return res.status(400).json(new apiResponse(400, null, "Content is required"));
    }
    
    try {
        // Use comprehensive AI analysis (mood + CBT distortions)
        let analysisResult = {
            mood: 'neutral',
            cbtAnalysis: null
        };
        
        try {
            analysisResult = await aiService.analyzeJournalComprehensive(content);
            console.log('Comprehensive analysis result:', analysisResult);
        } catch (aiError) {
            console.error('AI analysis failed (non-critical):', aiError);
            // Continue with default analysis
        }

        // Generate a title from the first few words of the content
        const words = content.trim().split(/\s+/).filter(word => word.length > 0);
        const title = words.length > 0 
            ? (words.slice(0, 5).join(' ') + (words.length > 5 ? '...' : ''))
            : 'Untitled Entry';

        console.log('Creating journal entry with title:', title, 'content length:', content.length);
        console.log('Title validation - length:', title.length, 'is empty:', title.trim().length === 0);

        // Ensure title is never empty
        const finalTitle = title.trim().length > 0 ? title.trim() : 'Untitled Entry';
        console.log('Final title:', finalTitle);

        const entry = await Journal.create({
            user: req.user._id,
            title: finalTitle,
            content,
            mood: analysisResult.mood,
            cbtAnalysis: analysisResult.cbtAnalysis,
        });

        // Try to update gamification, but don't fail the whole request if it fails
        try {
            await gamificationService.addPointsAndCheckBadges({ userId: req.user._id, points: 10 });
            await gamificationService.updateUserStreak(req.user._id);
        } catch (gamificationError) {
            console.error('Gamification error (non-critical):', gamificationError);
            // Continue with the response even if gamification fails
        }
        
        return res.status(201).json(new apiResponse(201, entry, "Journal entry created successfully"));
    } catch (error) {
        console.error('Journal creation error:', error);
        return res.status(500).json(new apiResponse(500, null, "Failed to create journal entry"));
    }
});

const getUserEntries = asyncHandler(async (req, res) => {
    const entries = await Journal.find({ user: req.user._id }).sort({ createdAt: -1 });
    return res.status(200).json(new apiResponse(200, entries, "Journal entries retrieved successfully"));
});

export { createJournalEntry, getUserEntries };