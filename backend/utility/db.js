const mongoose = require("mongoose");
require('dotenv').config();

const uri = process.env.MONGODB_URI || "mongodb+srv://siddeswar0605:siddeswar@cluster0.0lw2o.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const connectDb = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Database connected successfully");
        
    } catch (error) {
        console.error("Database connection failed:", error.message);
        throw error;
    }
}

module.exports = connectDb;