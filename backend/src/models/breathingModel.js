// src/models/BreathingSession.model.js
import mongoose from 'mongoose';

const breathingSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  durationInSeconds: {
    type: Number,
    required: true,
  },
  score: { // e.g., bubbles popped
    type: Number,
    default: 0,
  },
  pointsAwarded: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

export const BreathingSession = mongoose.model('BreathingSession', breathingSessionSchema);