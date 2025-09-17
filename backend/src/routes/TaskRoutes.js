// src/routes/tasks.routes.js
import { Router } from 'express';
import { getDailyTasks, completeTask } from '../controllers/tasks.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.use(authMiddleware);

router.route('/').get(getDailyTasks);
router.route('/:taskId/complete').post(completeTask);

export default router;