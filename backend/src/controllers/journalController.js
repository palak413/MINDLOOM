// src/controllers/journal.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { Journal } from "../models/journalModel.js";
import { aiService } from "../services/ai.service.js";
import { gamificationService } from "../services/gamification.service.js";

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