// src/models/Plant.model.js
import mongoose from 'mongoose';

const plantSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  growthPoints: {
    type: Number,
    default: 0,
  },
  growthLevel: {
    type: Number,
    default: 1,
  },
  healthStatus: {
    type: String,
    enum: ['healthy', 'pale', 'wilting'],
    default: 'healthy',
  },
  lastWatered: {
    type: Date,
    default: Date.now,
  },
  weather: {
    type: String,
    enum: ['sunny', 'cloudy', 'rainy', 'stormy'],
    default: 'sunny',
  },
}, { timestamps: true });

export const Plant = mongoose.model('Plant', plantSchema);