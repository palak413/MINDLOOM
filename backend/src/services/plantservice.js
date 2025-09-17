// src/services/plant.service.js
import { Plant } from '../models/plantModel.js';
import { apiError } from '../utils/apiError.js';
import { gamificationService } from './gamificationservice.js';

const POINTS_FOR_WATERING = 10;

/**
 * Retrieves the plant associated with a user.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Plant>} The user's plant document.
 */
const getPlantForUser = async (userId) => {
    const plant = await Plant.findOne({ user: userId });
    if (!plant) {
        throw new apiError(404, "Plant not found for this user");
    }
    return plant;
};

/**
 * Waters a user's plant, updating its health and awarding points.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Plant>} The updated plant document.
 */
const waterUserPlant = async (userId) => {
    const plant = await getPlantForUser(userId);

    // Increase health, capped at 100
    plant.health = Math.min(100, plant.health + 25);
    plant.lastWateredAt = new Date();
    
    await plant.save();

    // Award points for the action
    await gamificationService.addPointsAndCheckBadges({ 
        userId, 
        points: POINTS_FOR_WATERING 
    });

    return plant;
};

export const plantService = {
    getPlantForUser,
    waterUserPlant,
};