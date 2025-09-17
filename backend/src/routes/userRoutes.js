// src/routes/user.routes.js
import { Router } from 'express';
import {
  getCurrentUser,
  updateUserDetails,
  changeCurrentPassword
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';

const router = Router();

// Apply auth middleware to all routes in this file
router.use(authMiddleware);

router.route('/me').get(getCurrentUser);
router.route('/update-details').patch(updateUserDetails);
router.route('/change-password').post(changeCurrentPassword);

export default router;