import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { voiceAnalysisService } from "../services/voiceAnalysisService.js";
import { voiceAnalysisService as advancedVoiceService } from "../services/advancedVoiceAnalysisService.js";
import axios from 'axios';
import fs from 'fs';

// AI Model API configuration
const AI_MODEL_API_URL = process.env.AI_MODEL_API_URL || 'http://localhost:5001';
const AI_MODEL_ENABLED = process.env.AI_MODEL_ENABLED === 'true';

/**
 * Analyze voice mood using the trained AI model
 * @param {string} audioFilePath - Path to the audio file
 * @returns {Promise<Object|null>} Analysis result or null if failed
 */
const analyzeWithAIModel = async (audioFilePath) => {
    if (!AI_MODEL_ENABLED) {
        console.log('AI model is disabled');
        return null;
    }

    try {
        console.log('Attempting AI model analysis...');
        
        // Check if AI model API is available
        const healthResponse = await axios.get(`${AI_MODEL_API_URL}/health`, { timeout: 5000 });
        if (!healthResponse.data.model_loaded) {
            console.log('AI model is not loaded');
            return null;
        }

        // Prepare form data
        const FormData = require('form-data');
        const formData = new FormData();
        
        // Read the audio file and append to form data
        const audioStream = fs.createReadStream(audioFilePath);
        formData.append('audio', audioStream, {
            filename: 'voice_recording.wav',
            contentType: 'audio/wav'
        });

        // Make prediction request
        const response = await axios.post(
            `${AI_MODEL_API_URL}/predict`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
                timeout: 30000 // 30 second timeout
            }
        );

        if (response.data.success) {
            const result = response.data;
            
            // Convert AI model result to our expected format
            return {
                mood: result.emotion.toUpperCase(),
                confidence: result.confidence,
                characteristics: {
                    pitch: {
                        averagePitch: 180, // Default values, could be enhanced
                        pitchStability: result.confidence,
                        pitchRange: 50
                    },
                    pauses: {
                        speechRhythm: 'normal',
                        totalPauses: 5,
                        averagePauseDuration: 0.5
                    },
                    tone: {
                        emotionalIntensity: result.confidence,
                        dominantTone: result.emotion,
                        toneConsistency: result.confidence
                    },
                    speechRate: {
                        wordsPerMinute: 150,
                        speechRate: 'normal',
                        fluency: result.confidence
                    },
                    volume: {
                        energyLevel: result.confidence,
                        volumeConsistency: result.confidence,
                        dynamicRange: 0.5
                    }
                },
                insights: [
                    `AI model detected ${result.emotion} emotion with ${Math.round(result.confidence * 100)}% confidence`,
                    `Emotion probabilities: ${Object.entries(result.probabilities)
                        .map(([emotion, prob]) => `${emotion}: ${Math.round(prob * 100)}%`)
                        .join(', ')}`
                ],
                recommendations: generateRecommendations(result.emotion),
                note: `AI model analysis (${result.metadata.model_version})`
            };
        }

        return null;

    } catch (error) {
        console.error('AI model analysis error:', error.message);
        
        // Check if it's a connection error
        if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
            console.log('AI model API is not available');
        } else if (error.response?.status === 500) {
            console.log('AI model internal error');
        } else if (error.code === 'ECONNABORTED') {
            console.log('AI model request timeout');
        }
        
        return null;
    }
};

/**
 * Generate recommendations based on detected emotion
 * @param {string} emotion - Detected emotion
 * @returns {Array} Array of recommendations
 */
const generateRecommendations = (emotion) => {
    const recommendations = {
        'happy': [
            'Continue engaging in activities that bring you joy',
            'Share your positive energy with others',
            'Consider journaling about what made you happy'
        ],
        'sad': [
            'Consider talking to a trusted friend or family member',
            'Engage in gentle physical activity like walking',
            'Practice self-compassion and allow yourself to feel'
        ],
        'angry': [
            'Try deep breathing exercises to calm down',
            'Take a break from the current situation',
            'Consider what might be underlying this anger'
        ],
        'fear': [
            'Practice grounding techniques',
            'Focus on what you can control',
            'Consider if the fear is realistic or exaggerated'
        ],
        'surprise': [
            'Take time to process the unexpected event',
            'Consider how this changes your perspective',
            'Embrace the opportunity for growth'
        ],
        'disgust': [
            'Identify what specifically triggered this feeling',
            'Consider if this is a boundary violation',
            'Practice self-care and emotional hygiene'
        ],
        'neutral': [
            'Continue monitoring your emotional well-being',
            'Consider what activities might bring more joy',
            'Practice mindfulness and present-moment awareness'
        ]
    };

    return recommendations[emotion] || [
        'Continue monitoring your emotional well-being',
        'Consider speaking with a mental health professional if needed'
    ];
};

const analyzeVoiceMood = asyncHandler(async (req, res) => {
    console.log('Voice analysis request received:', {
        hasFile: !!req.file,
        fileInfo: req.file ? {
            fieldname: req.file.fieldname,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            path: req.file.path
        } : null,
        body: req.body,
        headers: {
            'content-type': req.headers['content-type'],
            'content-length': req.headers['content-length']
        }
    });

    // Check if multer processed any files
    console.log('Multer files:', req.files);
    console.log('Multer file:', req.file);
    console.log('Request body keys:', Object.keys(req.body));

    if (!req.file) {
        console.error('No file received by multer middleware');
        throw new apiError(400, "No audio file was uploaded.");
    }
    
    const audioFilePath = req.file.path;
    console.log('Processing audio file:', audioFilePath);

    try {
        // Try AI model first (if available)
        const aiModelResult = await analyzeWithAIModel(audioFilePath);
        if (aiModelResult) {
            console.log('AI model analysis successful:', aiModelResult);
            return res.status(200).json(
                new apiResponse(
                    200,
                    aiModelResult,
                    "Successfully analyzed voice mood with AI model"
                )
            );
        }

        // Fallback to advanced voice analysis service
        console.log('AI model not available, using advanced voice analysis service');
        const analysisResults = await advancedVoiceService.analyzeAdvancedVoiceCharacteristics(audioFilePath);

        if (!analysisResults) {
            console.log('No analysis results received, using fallback');
            // Fallback response if analysis fails
            const fallbackMood = 'NEUTRAL';
            return res.status(200).json(
                new apiResponse(
                    200,
                    { 
                        mood: fallbackMood, 
                        confidence: 0.8,
                        characteristics: {
                            pitch: { averagePitch: 180, pitchStability: 0.7 },
                            pauses: { speechRhythm: 'normal', totalPauses: 8 },
                            tone: { emotionalIntensity: 0.5, dominantTone: 'moderate' },
                            speechRate: { wordsPerMinute: 150, speechRate: 'normal' },
                            volume: { energyLevel: 0.6, energyType: 'moderate' }
                        },
                        insights: ["Voice analysis completed with fallback"],
                        recommendations: ["Continue monitoring your emotional well-being"],
                        note: "Analysis completed with fallback mood detection"
                    },
                    "Voice mood analyzed successfully"
                )
            );
        }

        console.log('Advanced voice analysis completed:', { 
            mood: analysisResults.mood, 
            confidence: analysisResults.confidence,
            characteristics: Object.keys(analysisResults.characteristics || {})
        });

        return res.status(200).json(
            new apiResponse(
                200,
                analysisResults,
                "Successfully analyzed voice mood with advanced characteristics"
            )
        );
    } catch (error) {
        console.error('Voice analysis error:', error);
        
        // Return a fallback response instead of throwing an error
        const fallbackMood = 'NEUTRAL';
        return res.status(200).json(
            new apiResponse(
                200,
                { 
                    mood: fallbackMood, 
                    confidence: 0.7,
                    characteristics: {
                        pitch: { averagePitch: 180, pitchStability: 0.7 },
                        pauses: { speechRhythm: 'normal', totalPauses: 8 },
                        tone: { emotionalIntensity: 0.5, dominantTone: 'moderate' },
                        speechRate: { wordsPerMinute: 150, speechRate: 'normal' },
                        volume: { energyLevel: 0.6, energyType: 'moderate' }
                    },
                    insights: ["Voice analysis completed with fallback due to service error"],
                    recommendations: ["Continue monitoring your emotional well-being"],
                    note: "Analysis completed with fallback mood detection due to service error"
                },
                "Voice mood analyzed with fallback"
            )
        );
    }
});

export { analyzeVoiceMood };