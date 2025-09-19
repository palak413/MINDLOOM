// src/routes/auth.routes.js
import { Router } from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = Router();

// Public routes
router.route('/register').post(registerUser);
router.route('/login').post(loginUser);

// Secured route (requires a user to be logged in to log out)
router.route('/logout').post(authMiddleware, logoutUser);

export default router;