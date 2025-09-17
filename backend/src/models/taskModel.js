// src/models/Task.model.js
import mongoose from 'mongoose';

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  isCompleted: {
    type: Boolean,
    default: false,
  },
  assignedDate: { 
    type: Date,
    required: true,
  },
  points: { 
    type: Number,
    default: 10,
  },
  category: {
    type: String,
    enum: ['mindfulness', 'journaling', 'exercise', 'breathing'],
    default: 'mindfulness',
  }
}, { timestamps: true });

export const Task = mongoose.model('Task', taskSchema);