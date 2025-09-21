import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { chatService } from "../services/chatService.js";
import { apiError } from "../utils/apiError.js";

const handleChatMessage = asyncHandler(async (req, res) => {
    const { message, history } = req.body;

    if (!message) {
        throw new apiError(400, "A message is required.");
    }

    // The frontend sends the new message and the previous conversation history
    const aiResponse = await chatService.getChatbotResponse(message, history);

    return res.status(200).json(new apiResponse(200, { response: aiResponse }, "Response generated successfully"));
});

const handleAIAssistantMessage = asyncHandler(async (req, res) => {
    const { message, context } = req.body;

    if (!message) {
        throw new apiError(400, "A message is required.");
    }

    try {
        // Enhanced AI assistant response with mood awareness
        const aiResponse = await chatService.getAIAssistantResponse(message, context);

        return res.status(200).json(new apiResponse(200, aiResponse, "AI Assistant response generated successfully"));
    } catch (error) {
        console.error('AI Assistant error:', error);
        throw new apiError(500, "Failed to generate AI Assistant response");
    }
});

const handleVoiceAnalysis = asyncHandler(async (req, res) => {
    const { audioData, context } = req.body;

    if (!audioData) {
        throw new apiError(400, "Audio data is required.");
    }

    try {
        // Process voice analysis with AI model
        const voiceAnalysis = await chatService.analyzeVoiceWithAI(audioData, context);

        return res.status(200).json(new apiResponse(200, voiceAnalysis, "Voice analysis completed successfully"));
    } catch (error) {
        console.error('Voice analysis error:', error);
        throw new apiError(500, "Failed to analyze voice");
    }
});

export { handleChatMessage, handleAIAssistantMessage, handleVoiceAnalysis };