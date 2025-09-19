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
  },
  {
    // This automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
  }
);

const StoreItem = mongoose.model("StoreItem", storeItemSchema);

export default StoreItem;