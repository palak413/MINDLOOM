// src/routes/voice.routes.js
import { Router } from 'express';
import { upload } from '../middlewares/multer.middleware.js';
import { analyzeVoiceMood } from '../controllers/voice.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/analyze-mood').post(
    authMiddleware,
    upload.single('audio'),
    analyzeVoiceMood
);

export default router;