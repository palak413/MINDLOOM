// src/routes/breathing.routes.js
import { Router } from 'express';
import { logSession } from '../controllers/breathingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// User must be logged in to log a breathing session
router.route('/session').post(authMiddleware, logSession);

export default router;