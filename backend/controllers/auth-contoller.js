// Import necessary modules
const User = require("../models/usermodel"); // User model for database interaction
const bcrypt = require('bcryptjs'); // Library for hashing passwords
const jwt = require('jsonwebtoken'); // Library for creating JSON Web Tokens

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
    const { userType, username, email, phone, address, password, latitude, longitude } = req.body;

    if (!latitude || !longitude) {
      return res.status(400).json({ msg: "Location coordinates are required" });
    }

    const userExist = await User.findOne({ email });
    if (userExist) {
      console.log(`User with email ${email} already exists`);
      return res.status(400).json({ msg: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      userType,
      username,
      email,
      phone,
      address,
      password: hashedPassword,
      location: { type: "Point", coordinates: [longitude, latitude] }, // GeoJSON format
    });

    const token = jwt.sign({ userId: user._id, userType: user.userType }, process.env.JWT_SECRET || 'your_secret_key', { expiresIn: '1h' });

    console.log("User registered successfully");

    return res.status(201).json({
      msg: "User registered successfully",
      token: token,
      userId: user._id.toString(),
    });

  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Login Route
const login = async (req, res) => {
  try {
    const {username, email, password } = req.body; // Use email instead of username
    const userExist = await User.findOne({ email });
    console.log(req.body);

    if (!userExist) {
      return res.status(401).json({ msg: "User does not exist" });
    }

    // Check password
    const isPasswordCorrect = await bcrypt.compare(password, userExist.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: "Invalid password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: userExist._id, userType: userExist.userType },
      process.env.JWT_SECRET || 'your_secret_key', 
      { expiresIn: '1h' }
    );

    console.log("Login successful");

    return res.status(200).json({
      msg: "Login successful",
      userType: userExist.userType,
      token: token, 
      username:userExist.username
      
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: error.message });
  }
};

// Institutes Route
const institutes = async (req, res) => {
  try {
    // Query the database for users with userType 'Institute' and only retrieve their usernames
    const institutes = await User.find({ userType: 'Institute' }, 'username'); // Fetch usernames of all institutes
    console.log("Finding institutes..."); // Log the action for debugging
    res.status(200).json(institutes); // Return the list of institutes with a 200 OK response
  } catch (error) {
    // If an error occurs, log the error and send a 500 response
    console.error("Error fetching institutes:", error); // Log the error for debugging
    res.status(500).json({ msg: "Error fetching institutes" }); // Send an error response with a 500 status
  }
};

// Export the route handlers for use in other parts of the application
module.exports = { home, register, login, institutes };
