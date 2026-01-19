/**
 * Routes for message analysis
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const Message = require('../models/Message');

// Environment variable for Python backend URL
const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:5000';

/**
 * POST /analyze-message
 * Analyzes a message by forwarding to Python backend and storing result in MongoDB
 */
router.post('/analyze-message', async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Message is required and cannot be empty',
      });
    }

    // Forward message to Python backend
    let pythonResponse;
    try {
      pythonResponse = await axios.post(`${PYTHON_API_URL}/detect-scam`, {
        message: message.trim(),
      }, {
        timeout: 10000, // 10 second timeout
      });
    } catch (error) {
      // Handle Python backend errors
      if (error.code === 'ECONNREFUSED') {
        return res.status(503).json({
          success: false,
          error: 'Python ML backend is not available. Please ensure it is running.',
        });
      }
      
      if (error.response) {
        // Python backend returned an error
        return res.status(error.response.status || 500).json({
          success: false,
          error: error.response.data?.error || 'Error from Python backend',
        });
      }

      return res.status(500).json({
        success: false,
        error: 'Failed to connect to Python backend',
      });
    }

    // Extract prediction data from Python backend response
    const { prediction, probability, explanations } = pythonResponse.data;

    // Validate Python backend response
    if (!prediction || probability === undefined || !explanations) {
      return res.status(500).json({
        success: false,
        error: 'Invalid response from Python backend',
      });
    }

    // Get client IP address (if available)
    const ipAddress = req.ip || req.connection.remoteAddress || null;

    // Store result in MongoDB (try-catch to handle MongoDB connection issues)
    let savedMessage;
    try {
      savedMessage = await Message.create({
        message: message.trim(),
        prediction,
        probability,
        explanations,
        ipAddress,
      });
    } catch (dbError) {
      console.warn('Database save failed (MongoDB may not be connected):', dbError.message);
      // Create a mock saved message object for response
      savedMessage = {
        _id: 'mock-id-' + Date.now(),
        message: message.trim(),
        prediction,
        probability,
        explanations,
        timestamp: new Date(),
      };
    }

    // Return response to frontend
    res.status(200).json({
      success: true,
      data: {
        id: savedMessage._id,
        message: savedMessage.message,
        prediction: savedMessage.prediction,
        probability: savedMessage.probability,
        explanations: savedMessage.explanations,
        timestamp: savedMessage.timestamp,
      },
    });
  } catch (error) {
    console.error('Error in /analyze-message:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error',
      message: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
});

/**
 * GET /messages
 * Retrieve stored messages (for analytics/history)
 * Optional query parameters: limit, skip, prediction
 */
router.get('/messages', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;
    const prediction = req.query.prediction; // Optional filter: 'Scam' or 'Legit'

    // Build query
    const query = {};
    if (prediction && ['Scam', 'Legit'].includes(prediction)) {
      query.prediction = prediction;
    }

    // Fetch messages
    const messages = await Message.find(query)
      .sort({ createdAt: -1 }) // Most recent first
      .limit(limit)
      .skip(skip)
      .select('-ipAddress') // Don't send IP address to frontend
      .lean();

    // Get total count
    const total = await Message.countDocuments(query);

    res.status(200).json({
      success: true,
      data: {
        messages,
        pagination: {
          total,
          limit,
          skip,
          hasMore: skip + limit < total,
        },
      },
    });
  } catch (error) {
    console.error('Error in /messages:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve messages',
    });
  }
});

/**
 * GET /stats
 * Get statistics about analyzed messages
 */
router.get('/stats', async (req, res) => {
  try {
    const totalMessages = await Message.countDocuments();
    const scamCount = await Message.countDocuments({ prediction: 'Scam' });
    const legitCount = await Message.countDocuments({ prediction: 'Legit' });

    // Get average probability for scams
    const scamStats = await Message.aggregate([
      { $match: { prediction: 'Scam' } },
      {
        $group: {
          _id: null,
          avgProbability: { $avg: '$probability' },
          minProbability: { $min: '$probability' },
          maxProbability: { $max: '$probability' },
        },
      },
    ]);

    // Get average probability for legit messages
    const legitStats = await Message.aggregate([
      { $match: { prediction: 'Legit' } },
      {
        $group: {
          _id: null,
          avgProbability: { $avg: '$probability' },
          minProbability: { $min: '$probability' },
          maxProbability: { $max: '$probability' },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalMessages,
        scamCount,
        legitCount,
        scamPercentage: totalMessages > 0 ? ((scamCount / totalMessages) * 100).toFixed(2) : 0,
        legitPercentage: totalMessages > 0 ? ((legitCount / totalMessages) * 100).toFixed(2) : 0,
        scamStats: scamStats[0] || null,
        legitStats: legitStats[0] || null,
      },
    });
  } catch (error) {
    console.error('Error in /stats:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve statistics',
    });
  }
});

module.exports = router;
