// src/routes/breathing.routes.js
import { Router } from 'express';
import { logSession, getSessions } from '../controllers/breathingController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.use(authMiddleware);

// Log a breathing session
router.route('/session').post(logSession);

// Get breathing sessions
router.route('/sessions').get(getSessions);

export default router;