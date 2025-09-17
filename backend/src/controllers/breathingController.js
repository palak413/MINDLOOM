// src/controllers/breathing.controller.js
import { gamificationService } from '../services/gamificationservice.js';
import { BreathingSession } from '../models/breathingModel.js';
import { apiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const logSession = asyncHandler(async (req, res) => {
  const { durationInSeconds, score } = req.body;
  const userId = req.user._id;

  // Business logic: 1 point for every 5 seconds of exercise
  const pointsAwarded = Math.floor(durationInSeconds / 5);

  // Log the session
  await BreathingSession.create({
    user: userId,
    durationInSeconds,
    score,
    pointsAwarded,
  });

  // Call the service to add points to the plant
  const updatedPlant = await gamificationService.addGrowthPoints(userId, pointsAwarded);

  return res.status(200).json(
    new apiResponse(200, updatedPlant, "Breathing session logged successfully!")
  );
});

export { logSession };