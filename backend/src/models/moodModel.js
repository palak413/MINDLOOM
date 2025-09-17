// src/models/Mood.model.js
import mongoose from 'mongoose';

const moodSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mood: {
    type: String,
    enum: ['happy', 'calm', 'sad', 'anxious', 'angry', 'neutral'],
    required: true,
  },
  stressLevel: {
    type: Number,
    min: 1,
    max: 10,
    required: true,
  },
  notes: { 
    type: String,
    trim: true,
  }
}, { timestamps: true }); 

export const Mood = mongoose.model('Mood', moodSchema);