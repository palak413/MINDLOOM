// src/jobs/dailyReset.job.js
import cron from 'node-cron';
import { User } from '../models/userModel.js';
import { Task } from '../models/taskModel.js';

// The list of tasks to be created for each user daily
const getDefaultTasks = (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return [
        {
            user: userId,
            description: "Complete a 5-minute bubble breathing exercise.",
            points: 15,
            category: 'breathing',
            assignedDate: today,
        },
        {
            user: userId,
            description: "Write a short journal entry about your day.",
            points: 10,
            category: 'journaling',
            assignedDate: today,
        },
        {
            user: userId,
            description: "Log your mood for today.",
            points: 5,
            category: 'mood',
            assignedDate: today,
        },
    ];
};

// Schedule the job to run at midnight every day ('0 0 * * *')
export const dailyResetJob = cron.schedule('0 0 * * *', async () => {
    console.log('🌅 Running daily task reset job...');
    try {
        const users = await User.find({}, '_id'); // Find all users, but only get their ID

        for (const user of users) {
            const tasks = getDefaultTasks(user._id);
            // Delete old, incomplete tasks if you want to prevent clutter
            // await Task.deleteMany({ user: user._id, isCompleted: false });
            
            await Task.insertMany(tasks);
        }

        console.log(`✅ Daily tasks successfully assigned to ${users.length} users.`);
    } catch (error) {
        console.error('❌ Error during daily task reset job:', error);
    }
}, {
    scheduled: false, // We will start this manually in server.js
    timezone: "Asia/Kolkata" // Set your timezone
});