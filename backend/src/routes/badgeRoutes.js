import { Router } from 'express';
import { getAllBadges } from '../controllers/badge.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();
router.use(authMiddleware);

router.route('/').get(getAllBadges);

export default router;