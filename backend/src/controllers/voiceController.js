import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { apiError } from "../utils/apiError.js";
import { voiceAnalysisService } from "../services/voiceAnalysis.service.js";

const analyzeVoiceMood = asyncHandler(async (req, res) => {
    if (!req.file) {
        throw new apiError(400, "No audio file was uploaded.");
    }
    const audioFilePath = req.file.path;

    // Call the new service for direct tone analysis
    const analysisResults = await voiceAnalysisService.analyzeAudioTone(audioFilePath);

    if (!analysisResults) {
        throw new apiError(500, "Could not analyze the mood from the voice.");
    }

    // The result from AssemblyAI is an array of sentiments detected in speech segments.
    // We can find the most common sentiment.
    const primarySentiment = analysisResults.length > 0 ? analysisResults[0].sentiment : "NEUTRAL";

    return res.status(200).json(
        new apiResponse(
            200,
            { mood: primarySentiment, details: analysisResults },
            "Successfully analyzed voice mood"
        )
    );
});

export { analyzeVoiceMood };