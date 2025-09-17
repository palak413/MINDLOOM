// src/routes/admin.routes.js
import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole
} from '../controllers/admin.controller.js';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import { roleMiddleware } from '../middlewares/role.middleware.js';

const router = Router();

// Apply authentication and admin role check to all routes in this file
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Define the admin-specific routes
router.route('/users').get(getAllUsers);
router.route('/users/:userId').get(getUserById);
router.route('/users/:userId/update-role').patch(updateUserRole);

export default router;