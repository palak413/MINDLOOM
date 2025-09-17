import { Router } from 'express';
import { handleChatMessage } from '../controllers/chat.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// All chat routes require a user to be logged in
router.use(authMiddleware);

router.route('/').post(handleChatMessage);

export default router;