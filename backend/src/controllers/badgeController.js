import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Badge } from "../models/badgeModel.js";

const getAllBadges = asyncHandler(async (req, res) => {
    const badges = await Badge.find({}).sort({ pointsRequired: 1 });
    return res.status(200).json(new apiResponse(200, badges, "All badges retrieved successfully"));
});

export { getAllBadges };