import { User } from '../models/userModel.js';
import { StoreItem } from '../models/storeItemModel.js';
import { apiError } from '../utils/apiError.js';

/**
 * Handles the logic for a user purchasing an item from the store.
 * @param {string} userId - The ID of the user making the purchase.
 * @param {string} itemId - The ID of the item being purchased.
 * @returns {Promise<User>} The updated user document.
 */
const purchaseItem = async (userId, itemId) => {
    const user = await User.findById(userId);
    const item = await StoreItem.findById(itemId);

    if (!item) {
        throw new apiError(404, "Store item not found.");
    }
    if (user.points < item.cost) {
        throw new apiError(400, "You do not have enough points to purchase this item.");
    }
    if (user.inventory.includes(itemId)) {
        throw new apiError(400, "You already own this item.");
    }

    // Perform the transaction
    user.points -= item.cost;
    user.inventory.push(itemId);
    
    await user.save({ validateBeforeSave: false });

    return user;
};

export const storeService = {
    purchaseItem,
};