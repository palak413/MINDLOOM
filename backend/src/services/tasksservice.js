// src/services/task.service.js
import { Task } from '../models/taskModel.js';
import { apiError } from '../utils/apiError.js';
import { gamificationService } from './gamificationservice.js';

/**
 * Gets all of a user's tasks for the current day.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Task[]>} An array of task documents.
 */
const getDailyTasksForUser = async (userId) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tasks = await Task.find({ user: userId, assignedDate: { $gte: today } });
    return tasks;
};

/**
 * Marks a task as complete and triggers gamification logic.
 * @param {string} userId - The ID of the user.
 * @param {string} taskId - The ID of the task to complete.
 * @returns {Promise<Task>} The completed task document.
 */
const completeUserTask = async (userId, taskId) => {
    const task = await Task.findById(taskId);

    if (!task) {
        throw new apiError(404, "Task not found");
    }
    if (task.user.toString() !== userId) {
        throw new apiError(403, "You are not authorized to complete this task");
    }
    if (task.isCompleted) {
        throw new apiError(400, "This task has already been completed");
    }

    task.isCompleted = true;
    task.completedAt = new Date();
    await task.save();

    // Award points and update the user's streak
    await gamificationService.addPointsAndCheckBadges({ userId, points: task.points });
    await gamificationService.updateUserStreak(userId);

    return task;
};

export const taskService = {
    getDailyTasksForUser,
    completeUserTask,
};