// src/jobs/streak.job.js
import cron from 'node-cron';
import { User } from '../models/userModel.js';

/**
 * This job runs daily to reset the streaks of inactive users.
 * A user is considered inactive if their last activity was before "yesterday".
 * The logic to INCREMENT the streak should be in the relevant controllers
 * (e.g., tasks.controller.js).
 */
export const dailyStreakResetJob = cron.schedule('5 0 * * *', async () => {
    console.log('🔥 Running daily user streak reset job...');
    try {
        // Get the date for the beginning of yesterday.
        // If a user's last activity was before this, their streak is broken.
        const startOfYesterday = new Date();
        startOfYesterday.setDate(startOfYesterday.getDate() - 1);
        startOfYesterday.setHours(0, 0, 0, 0);

        // Find all users who have an active streak but whose last activity
        // was before the start of yesterday.
        const result = await User.updateMany(
            {
                lastActivityDate: { $lt: startOfYesterday },
                currentStreak: { $gt: 0 } // Only update users who have a streak to reset
            },
            {
                $set: { currentStreak: 0 } // Reset their streak
            }
        );

        if (result.modifiedCount > 0) {
            console.log(`- Streak reset for ${result.modifiedCount} inactive users.`);
        } else {
            console.log('- No streaks needed resetting.');
        }

        console.log('✅ Daily streak reset job finished successfully.');

    } catch (error) {
        console.error('❌ Error during daily streak reset job:', error);
    }
}, {
    scheduled: false, // Start this manually in server.js
    timezone: "Asia/Kolkata"
});