const mongoose = require('mongoose');

// MongoDB connection URL (adjust as needed)
const mongoURL = 'mongodb://localhost:27017/voting';

// Function to connect to the database
const connectDB = async () => {
    try {
        await mongoose.connect(mongoURL);
        console.log('Connected to MongoDB server');
    } catch (error) {
        console.error('MongoDB server error:', error);
        process.exit(1); // Exit the process with failure
    }
};

// Event listeners for the database connection
const db = mongoose.connection;

db.on('disconnected', () => {
    console.log('MongoDB disconnected');
});

// Export the connectDB function
module.exports = connectDB;
