import { Router } from 'express';
import { handleChatMessage } from '../controllers/chatController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// All chat routes require a user to be logged in
router.use(authMiddleware);

router.route('/').post(handleChatMessage);

export default router;