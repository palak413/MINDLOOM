import axios from 'axios';
import fs from 'fs';

// Your AssemblyAI API key would go in your .env file
const ASSEMBLYAI_API_KEY = process.env.ASSEMBLYAI_API_KEY;

const apiClient = axios.create({
    baseURL: "https://api.assemblyai.com/v2",
    headers: {
        "authorization": ASSEMBLYAI_API_KEY,
        "content-type": "application/json",
    },
});

/**
 * Analyzes the emotional tone of an audio file using AssemblyAI.
 * @param {string} filePath - The local path to the audio file.
 * @returns {Promise<object>} The analysis result containing detected tones.
 */
const analyzeAudioTone = async (filePath) => {
    try {
        // Step 1: Upload the audio file to AssemblyAI's servers
        const uploadResponse = await apiClient.post('/upload', fs.readFileSync(filePath));
        const upload_url = uploadResponse.data.upload_url;

        // Step 2: Submit the uploaded audio for analysis, enabling tone detection
        const submitResponse = await apiClient.post('/transcript', {
            audio_url: upload_url,
            disfluencies: true, // Optional: helps with accuracy
            sentiment_analysis: true // Enable this for sentiment labels
        });
        const transcriptId = submitResponse.data.id;

        // Step 3: Poll the API until the analysis is complete
        while (true) {
            const pollResponse = await apiClient.get(`/transcript/${transcriptId}`);
            const status = pollResponse.data.status;

            if (status === 'completed') {
                // Return the sentiment analysis results
                return pollResponse.data.sentiment_analysis_results;
            } else if (status === 'failed') {
                throw new Error("Voice analysis failed.");
            }
            
            // Wait for a few seconds before polling again
            await new Promise((resolve) => setTimeout(resolve, 3000));
        }

    } catch (error) {
        console.error("Error with AssemblyAI service:", error.response?.data || error.message);
        throw new Error("Failed to analyze audio tone.");
    } finally {
        // Clean up the temporary file
        fs.unlinkSync(filePath);
    }
};

export const voiceAnalysisService = {
    analyzeAudioTone,
};