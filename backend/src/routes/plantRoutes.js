// src/routes/plant.routes.js
import { Router } from 'express';
import { getMyPlant, waterMyPlant } from '../controllers/plant.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// All plant routes require a user to be logged in
router.use(authMiddleware);

router.route('/me').get(getMyPlant);
router.route('/water').post(waterMyPlant);

export default router;