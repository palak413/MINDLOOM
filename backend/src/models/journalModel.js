// src/models/Journal.model.js
import mongoose from 'mongoose';

const journalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
    required: true,
  },
  mood: { // Link to the mood logged at the time
    type: String,
  },
}, { timestamps: true });

export const Journal = mongoose.model('Journal', journalSchema);