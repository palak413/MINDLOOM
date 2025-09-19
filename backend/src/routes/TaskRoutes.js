// src/routes/tasks.routes.js
import { Router } from 'express';
import { getDailyTasks, completeTask } from '../controllers/taskController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

router.route('/').get(getDailyTasks);
router.route('/:taskId/complete').post(completeTask);

export default router;