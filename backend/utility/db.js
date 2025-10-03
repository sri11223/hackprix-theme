const mongoose = require("mongoose");
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb+srv://siddeswar0605:siddeswar@cluster0.0lw2o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

let isConnected = false;

const connectDb = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 15000, // Increase timeout to 15 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            // Remove bufferCommands: false to allow buffering until connection is ready
            maxPoolSize: 10, // Maintain up to 10 socket connections
            minPoolSize: 5, // Maintain minimum 5 socket connections
            maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
        });
        
        isConnected = true;
        console.log("Database connected successfully");
        
        // Handle connection events
        mongoose.connection.on('error', (err) => {
            console.error('MongoDB connection error:', err);
            isConnected = false;
        });
        
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB disconnected');
            isConnected = false;
        });
        
    } catch (error) {
        console.error("Database connection failed:", error.message);
        isConnected = false;
        throw error;
    }
}

module.exports = connectDb;