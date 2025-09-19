// src/routes/mood.routes.js
import { Router } from 'express';
import { logMood } from '../controllers/moodController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// User must be logged in to log their mood
router.route('/').post(authMiddleware, logMood);

export default router;