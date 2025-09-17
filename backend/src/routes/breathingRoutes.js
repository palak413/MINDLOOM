// src/routes/breathing.routes.js
import { Router } from 'express';
import { logSession } from '../controllers/breathing.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// User must be logged in to log a breathing session
router.route('/session').post(authMiddleware, logSession);

export default router;