// src/routes/mood.routes.js
import { Router } from 'express';
import { logMood } from '../controllers/mood.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// User must be logged in to log their mood
router.route('/').post(authMiddleware, logMood);

export default router;