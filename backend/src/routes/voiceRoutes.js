// src/routes/voice.routes.js
import { Router } from 'express';
import { upload } from '../middlewares/multerMiddleware.js';
import { analyzeVoiceMood } from '../controllers/voiceController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

router.route('/analyze-mood').post(
    authMiddleware,
    upload.single('audio'),
    analyzeVoiceMood
);

export default router;