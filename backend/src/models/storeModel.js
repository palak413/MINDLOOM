import mongoose from 'mongoose';

const storeItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    description: {
        type: String,
        required: true,
    },
    cost: {
        type: Number,
        required: true,
        min: 0,
    },
    icon: { // URL for the item's image
        type: String,
        required: true,
    },
    category: {
        type: String,
        enum: ['plant_accessory', 'theme', 'avatar_frame'],
        default: 'plant_accessory',
    }
}, { timestamps: true });

export const StoreItem = mongoose.model('StoreItem', storeItemSchema);