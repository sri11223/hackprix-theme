const mongoose = require("mongoose");
const jwt = require('jsonwebtoken');

const schema = new mongoose.Schema({
    userType: {
        type: String,
        required: true,
        enum: ['Startup', 'Investor', 'JobSeeker', 'Recruiter', 'Freelancer']
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

// Pre-save middleware
schema.pre('save', async function () {
    console.log('pre defined ', this);
});

// JWT generation method
schema.methods.genrateToken = async function () {
    try {
        return jwt.sign(
            {
                userId: this._id.toString(),
                email: this.email,
                username: this.username
            },
             'default_secret', // Fallback for development
            { expiresIn: '1h' }
        );
    } catch (error) {
        console.error("Error generating token:", error);
        throw new Error("Token generation failed"); // Propagate the error for handling
    }
};

const User = mongoose.model("User", schema);
module.exports = User;
