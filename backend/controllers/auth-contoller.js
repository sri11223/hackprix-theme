// Import necessary modules
const { User, Individual, Startup, Investor } = require("../models/usermodel"); // Updated import for discriminators
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for creating JSON Web Tokens
const redis = require('../utility/redis'); // Import Redis (can be null if not configured)
const { sendUserRegisteredEvent } = require('../utility/kafka'); // Import Kafka utility
const { sendWelcomeEmail } = require('../utility/mailer'); // Import mailer utility

// Home Route
const home = async (req, res) => {
  try {
    // Respond with a simple greeting message
    res.status(200).send("hello"); // Sending a 200 OK response
  } catch (error) {
    // If an error occurs, send a 500 status with the error message
    res.status(500).send({ message: error.message }); // Log the error message for debugging
  }
};

// Register Route
const register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      username,
      email,
      phone,
      password,
      ...rest
    } = req.body;

    // Check if username is provided and not null/empty
    if (!username || typeof username !== 'string' || username.trim() === '') {
      return res.status(400).json({ msg: "Username is required and cannot be empty" });
    }
    // Check if user already exists
    const userExist = await User.findOne({ $or: [{ email }, { username }, ] });
    if (userExist) {
      return res.status(400).json({ msg: "User already exists" });
    }
    // Check for missing fields
    if (!firstName || !lastName || !email || !password || !phone) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Prepare base user data
    const baseUserData = {
      firstName,
      lastName,
      username,
      email,
      phone,
      password: hashedPassword
    };

    let user;
    // Only create a base user at registration (no userType/discriminator)
    user = await User.create(baseUserData);

    // Send Kafka event
    try {
      await sendUserRegisteredEvent({
        userId: user._id,
        email: user.email,
        firstName: user.firstName,
      });
      console.log('Kafka event sent for user registration');
    } catch (kafkaErr) {
      console.error('Kafka event error:', kafkaErr);
    }

    // Send welcome email
    try {
      await sendWelcomeEmail(user.email, user.firstName);
      console.log('Welcome email sent');
    } catch (emailErr) {
      console.error('Error sending welcome email:', emailErr);
    }

    // Generate token
    const token = jwt.sign(
      {
        userId: user._id
        // userType is not included at registration
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' } // Changed to 7 days
    );

    // Optionally cache the user profile (only if Redis is available)
    if (redis) {
      try {
        await redis.set(`cache:/api/auth/profile:${user._id}`, JSON.stringify(user), 'EX', 300);
      } catch (err) {
        console.warn('Redis cache operation failed:', err.message);
      }
    }

    return res.status(201).json({
      msg: "User registered successfully",
      token: token,
      userId: user._id.toString(),
      // Remove userType from response for now, since it's not set at registration
    });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Login Route
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userExist = await User.findOne({ email }).select('+password');

    if (!userExist) {
      return res.status(401).json({ msg: "User does not exist" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    console.log('Creating token for user:', { 
      id: userExist._id, 
      userType: userExist.userType 
    });
    
    const token = jwt.sign(
      {
        userId: userExist._id,
        userType: userExist.userType
      },
      process.env.JWT_SECRET || 'your_secret_key',
      { expiresIn: '7d' }
    );
    
    console.log('Generated token:', token);

    return res.status(200).json({
      msg: "Login successful",
      token: token,
      userType: userExist.userType,
      username: userExist.username,
      firstName: userExist.firstName,
      lastName: userExist.lastName
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Institutes Route
const institutes = async (req, res) => {
  try {
    // Query the database for users with userType 'STARTUP' and only retrieve their companyName
    const startups = await Startup.find({}, 'companyName');
    res.status(200).json(startups);
  } catch (error) {
    console.error("Error fetching startups:", error);
    res.status(500).json({ msg: "Error fetching startups" });
  }
};

// Update Profile Route
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const updates = req.body;
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      { new: true }
    ).select('-password');

    // Invalidate the cache for this user's profile (only if Redis is available)
    if (redis) {
      try {
        await redis.del(`cache:/api/auth/profile:${userId}`);
      } catch (err) {
        console.warn('Redis cache operation failed:', err.message);
      }
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(500).json({ msg: error.message });
  }
};

// Export the route handlers for use in other parts of the application
module.exports = { home, register, login, institutes, updateProfile };
