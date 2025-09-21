// src/routes/mood.routes.js
import { Router } from 'express';
import { logMood, getMoodHistory } from '../controllers/moodController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// User must be logged in to access mood routes
router.use(authMiddleware);

// Log a new mood entry
router.route('/').post(logMood);

// Get mood history
router.route('/').get(getMoodHistory);

export default router;