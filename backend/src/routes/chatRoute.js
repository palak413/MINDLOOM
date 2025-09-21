import { Router } from 'express';
import { handleChatMessage, handleAIAssistantMessage, handleVoiceAnalysis } from '../controllers/chatController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// All chat routes require a user to be logged in
router.use(authMiddleware);

// Basic chat endpoint
router.route('/').post(handleChatMessage);

// Enhanced AI Assistant endpoints
router.route('/send').post(handleAIAssistantMessage);
router.route('/voice-analysis').post(handleVoiceAnalysis);

export default router;