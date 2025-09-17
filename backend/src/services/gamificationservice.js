// src/services/gamification.service.js
import { User } from '../models/userModel.js';
import { Badge } from '../models/badgeModel.js';
import { isSameDay, isYesterday } from 'date-fns';
import { getIO } from '../socket/index.js';

/**
 * Updates a user's activity streak.
 * This should be called whenever a user completes a key daily action (like a task).
 * @param {string} userId - The ID of the user.
 * @returns {Promise<void>}
 */
const updateUserStreak = async (userId) => {
    const user = await User.findById(userId);
    if (!user) return;

    const today = new Date();
    const lastActivity = user.lastActivityDate;

    // If the last activity was yesterday, they are continuing the streak.
    if (lastActivity && isYesterday(lastActivity)) {
        user.currentStreak += 1;
    } 
    // If there was no last activity or it wasn't today, it's a new day's activity.
    // This starts or restarts the streak at 1.
    else if (!lastActivity || !isSameDay(lastActivity, today)) {
        user.currentStreak = 1;
    }
    // If the last activity was today, the streak is already counted for the day. Do nothing.

    user.lastActivityDate = today;
    await user.save({ validateBeforeSave: false });
};

/**
 * Adds points to a user's score and checks if they have earned any new badges.
 * If new badges are earned, it sends a real-time notification.
 * @param {object} options - The options object.
 * @param {string} options.userId - The ID of the user.
 * @param {number} options.points - The number of points to add.
 * @returns {Promise<void>}
 */
const addPointsAndCheckBadges = async ({ userId, points }) => {
    const user = await User.findById(userId);
    if (!user) return;

    // Add points to the user's total
    user.points += points;

    // Check for any new badges the user has now qualified for
    const unearnedBadges = await Badge.find({ 
        _id: { $nin: user.badges }, // Find badges not already in the user's badge array
        pointsRequired: { $lte: user.points } // where the user's points meet the requirement
    });

    if (unearnedBadges.length > 0) {
        const io = getIO(); // Get the Socket.IO instance
        
        const newBadgeIds = unearnedBadges.map(badge => {
            // Emit a real-time 'new_badge' event to this specific user
            io.to(userId.toString()).emit('new_badge', {
                name: badge.name,
                description: badge.description,
                icon: badge.icon
            });
            return badge._id;
        });
        
        // Add the new badge IDs to the user's profile
        user.badges.push(...newBadgeIds);
    }

    await user.save({ validateBeforeSave: false });
};

export const gamificationService = {
    updateUserStreak,
    addPointsAndCheckBadges,
};