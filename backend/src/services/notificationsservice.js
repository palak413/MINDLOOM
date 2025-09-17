// src/services/notification.service.js

/**
 * Sends a notification when a user earns a new badge.
 * (Placeholder for a real notification system)
 * @param {string} userId - The ID of the user.
 * @param {string} badgeName - The name of the badge earned.
 */
const sendNewBadgeNotification = (userId, badgeName) => {
    console.log(`[NOTIFICATION] User ${userId} has earned the "${badgeName}" badge!`);
    // In a real app, this would trigger a push notification, email, etc.
};

/**
 * Sends a notification when a user's plant health is low.
 * (Placeholder for a real notification system)
 * @param {string} userId - The ID of the user.
 */
const sendPlantHealthWarning = (userId) => {
    console.log(`[NOTIFICATION] User ${userId}'s plant is not feeling well. It might need watering!`);
};

export const notificationService = {
    sendNewBadgeNotification,
    sendPlantHealthWarning,
};