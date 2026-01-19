/**
 * Node.js + Express backend server
 * CyberGuard Bot - Scam Detection Chatbot
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');
const messageRoutes = require('./routes/messageRoutes');

// Initialize Express app
const app = express();

// Middleware
app.use(cors()); // Enable CORS for frontend
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Trust proxy for accurate IP addresses
app.set('trust proxy', 1);

// Connect to MongoDB
connectDB();

// Routes
app.use('/api', messageRoutes);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    message: 'CyberGuard Bot - Node.js Backend API',
    endpoints: {
      'POST /api/analyze-message': 'Analyze a message for scam detection',
      'GET /api/messages': 'Retrieve stored messages (with pagination)',
      'GET /api/stats': 'Get statistics about analyzed messages',
    },
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error',
  });
});

// Server configuration
const PORT = process.env.PORT || 4000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Start server
app.listen(PORT, () => {
  console.log('\n' + '='.repeat(60));
  console.log('🚀 CyberGuard Bot - Node.js Backend Server');
  console.log('='.repeat(60));
  console.log(`\n✅ Server running in ${NODE_ENV} mode`);
  console.log(`✅ Server listening on port ${PORT}`);
  console.log(`✅ Python API URL: ${process.env.PYTHON_API_URL || 'http://localhost:5000'}`);
  console.log(`✅ MongoDB URI: ${process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberguard_bot'}`);
  console.log('\n📡 Available endpoints:');
  console.log('   POST   /api/analyze-message  - Analyze message for scams');
  console.log('   GET    /api/messages         - Get stored messages');
  console.log('   GET    /api/stats            - Get statistics');
  console.log('   GET    /                     - Health check');
  console.log('\n' + '='.repeat(60) + '\n');
});

module.exports = app;
