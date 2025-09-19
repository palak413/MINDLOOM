// src/controllers/mood.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Mood } from "../models/moodModel.js";
import { gamificationService } from "../services/gamificationservice.js";
import { apiError } from "../utils/apiError.js";

const logMood = asyncHandler(async (req, res) => {
    const { mood, intensity } = req.body;
    if (!mood || !intensity) {
        throw new apiError(400, "Mood and intensity are required");
    }

    const moodEntry = await Mood.create({
        user: req.user._id,
        mood,
        intensity
    });

    await gamificationService.addPointsAndCheckBadges({ userId: req.user._id, points: 5 });
    await gamificationService.updateUserStreak(req.user._id);

    return res.status(201).json(new apiResponse(201, moodEntry, "Mood logged successfully"));
});

export { logMood };