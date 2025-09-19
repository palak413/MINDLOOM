// src/routes/admin.routes.js
import { Router } from 'express';
import {
  getAllUsers,
  getUserById,
  updateUserRole
} from '../controllers/adminController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

// Apply authentication and admin role check to all routes in this file
router.use(authMiddleware);
router.use(roleMiddleware('admin'));

// Define the admin-specific routes
router.route('/users').get(getAllUsers);
router.route('/users/:userId').get(getUserById);
router.route('/users/:userId/update-role').patch(updateUserRole);

export default router;