import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { plantService } from "../services/plantservice.js";

const getMyPlant = asyncHandler(async (req, res) => {
    const plant = await plantService.getPlantForUser(req.user._id);
    return res.status(200).json(new apiResponse(200, plant, "Plant details retrieved successfully"));
});

const waterMyPlant = asyncHandler(async (req, res) => {
    const updatedPlant = await plantService.waterUserPlant(req.user._id);
    return res.status(200).json(new apiResponse(200, updatedPlant, "Plant watered successfully"));
});

export { getMyPlant, waterMyPlant };