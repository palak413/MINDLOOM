// src/jobs/healthCheck.job.js
import cron from 'node-cron';
import { Plant } from '../models/plantModel.js';

// Schedule the job to run at 1 AM every day ('0 1 * * *')
export const dailyHealthCheckJob = cron.schedule('0 1 * * *', async () => {
    console.log("🌿 Running daily plant health check job...");
    try {
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        // Find all plants that haven't been watered in the last 24 hours
        // and whose health is greater than 0.
        const neglectedPlants = await Plant.find({
            lastWateredAt: { $lt: twentyFourHoursAgo },
            health: { $gt: 0 }
        });

        if (neglectedPlants.length === 0) {
            console.log("👍 All plants are healthy and watered. No action needed.");
            return;
        }

        // Decrease the health of each neglected plant
        for (const plant of neglectedPlants) {
            plant.health = Math.max(0, plant.health - 10); // Decrease health by 10, ensuring it doesn't go below 0
            await plant.save();
        }

        console.log(`💔 Health updated for ${neglectedPlants.length} neglected plants.`);

    } catch (error) {
        console.error('❌ Error during plant health check job:', error);
    }
}, {
    scheduled: false, // We will start this manually in server.js
    timezone: "Asia/Kolkata" // Set your timezone
});