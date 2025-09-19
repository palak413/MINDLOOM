import { Router } from 'express';
import {
    getAllItems,
    buyItem,
    createItem,
    updateItem,
    deleteItem
} from '../controllers/storeController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { roleMiddleware } from '../middlewares/roleMiddleware.js';

const router = Router();

// All store routes require a user to be logged in
router.use(authMiddleware);

// Routes for all users
router.route('/').get(getAllItems);
router.route('/:itemId/buy').post(buyItem);

// Routes for admins only
router.route('/').post(roleMiddleware('admin'), createItem);
router.route('/:itemId').patch(roleMiddleware('admin'), updateItem);
router.route('/:itemId').delete(roleMiddleware('admin'), deleteItem);

export default router;