import { asyncHandler } from "../utils/asyncHandler.js";
import { apiResponse } from "../utils/apiResponse.js";
import  StoreItem  from "../models/storeItemModel.js";
// AFTER (Correct):
import * as storeService from "../services/storeService.js";

const getAllItems = asyncHandler(async (req, res) => {
    const items = await StoreItem.find({}).sort({ cost: 1 });
    return res.status(200).json(new apiResponse(200, items, "Store items retrieved successfully"));
});

const buyItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const updatedUser = await storeService.purchaseItem(req.user._id, itemId);
    return res.status(200).json(new apiResponse(200, { points: updatedUser.points }, "Item purchased successfully"));
});

// --- Admin Functions ---
const createItem = asyncHandler(async (req, res) => {
    const { name, description, cost, icon, category } = req.body;
    const newItem = await StoreItem.create({ name, description, cost, icon, category });
    return res.status(201).json(new apiResponse(201, newItem, "Store item created successfully"));
});

const updateItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    const updatedItem = await StoreItem.findByIdAndUpdate(itemId, req.body, { new: true });
    return res.status(200).json(new apiResponse(200, updatedItem, "Store item updated successfully"));
});

const deleteItem = asyncHandler(async (req, res) => {
    const { itemId } = req.params;
    await StoreItem.findByIdAndDelete(itemId);
    return res.status(200).json(new apiResponse(200, {}, "Store item deleted successfully"));
});

export { getAllItems, buyItem, createItem, updateItem, deleteItem };