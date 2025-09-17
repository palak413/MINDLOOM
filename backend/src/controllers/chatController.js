import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { chatService } from "../services/chat.service.js";
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

export { handleChatMessage };