/**
 * MongoDB Schema for storing analyzed messages
 */

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, 'Message text is required'],
      trim: true,
    },
    prediction: {
      type: String,
      required: true,
      enum: ['Scam', 'Legit'],
    },
    probability: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    explanations: {
      type: [String],
      required: true,
      default: [],
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
    ipAddress: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

// Index for faster queries
messageSchema.index({ timestamp: -1 }); // Most recent first
messageSchema.index({ prediction: 1 }); // Filter by prediction
messageSchema.index({ createdAt: -1 }); // Sort by creation date

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
