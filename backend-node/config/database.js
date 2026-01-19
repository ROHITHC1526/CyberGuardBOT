/**
 * MongoDB database connection configuration
 */

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/cyberguard_bot', {
      // These options are no longer needed in newer versions of Mongoose
      // but kept for compatibility
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB connection error: ${error.message}`);
    console.error('Warning: Server will continue but database operations will fail.');
    console.error('Please ensure MongoDB is running or update MONGODB_URI in .env');
    // Don't exit - allow server to start for testing without MongoDB
    // process.exit(1);
  }
};

module.exports = connectDB;
