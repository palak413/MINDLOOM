import mongoose from "mongoose";

const storeItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    imageUrl: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ['plant-pot', 'plant-decor', 'plant-food', 'plant-tools', 'room-decor', 'accessories'],
      default: 'plant-pot'
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    effects: {
      type: Map,
      of: Number,
      default: {}
    },
    isActive: {
      type: Boolean,
      default: true
    },
    stock: {
      type: Number,
      default: -1 // -1 means unlimited
    }
  },
  {
    // This automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

const StoreItem = mongoose.model("StoreItem", storeItemSchema);

export default StoreItem;