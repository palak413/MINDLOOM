// src/models/Badge.model.js
import mongoose from 'mongoose';

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  iconUrl: { // URL to the badge image
    type: String,
    required: true,
  },
  criteria: { // A description of how to earn the badge
    type: String,
    required: true,
  },
});

// A separate model could track which users have earned which badges,
// or you could add an array of Badge ObjectIds to the User model.

export const Badge = mongoose.model('Badge', badgeSchema);