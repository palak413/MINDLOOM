// src/controllers/tasks.controller.js
import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import { taskService } from "../services/tasksservice.js";

const getDailyTasks = asyncHandler(async (req, res) => {
    const tasks = await taskService.getDailyTasksForUser(req.user._id);
    return res.status(200).json(new apiResponse(200, tasks, "Daily tasks retrieved successfully"));
});

const completeTask = asyncHandler(async (req, res) => {
    const { taskId } = req.params;
    const completedTask = await taskService.completeUserTask(req.user._id, taskId);
    return res.status(200).json(new apiResponse(200, { task: completedTask }, "Task marked as complete"));
});

export { getDailyTasks, completeTask };