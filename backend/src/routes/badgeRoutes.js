import { Router } from 'express';
import { getAllBadges } from '../controllers/badgeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();
router.use(authMiddleware);

router.route('/').get(getAllBadges);

export default router;