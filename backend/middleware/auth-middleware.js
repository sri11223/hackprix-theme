const jwt = require('jsonwebtoken');
const { User, Individual, Startup, Investor } = require('../models/usermodel');

const verifyToken = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        console.log('Auth Header:', authHeader); // Debug log

        const token = authHeader?.replace('Bearer ', '');
        console.log('Extracted Token:', token); // Debug log

        if (!token) {
            return res.status(401).json({ msg: 'No token provided' });
        }

        console.log('JWT Secret:', process.env.JWT_SECRET ? 'Present' : 'Missing');
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your_secret_key');
        console.log('Debug - Decoded Token:', decoded);
        
        // Check if userId exists in decoded token
        if (!decoded.userId) {
            console.log('Debug - No userId in token');
            return res.status(401).json({ msg: 'Invalid token structure' });
        }
        
        const user = await User.findById(decoded.userId);
        console.log('Debug - Found user in auth middleware:', user);
        
        if (!user) {
            console.log('Debug - User not found in auth middleware');
            return res.status(401).json({ msg: 'User not found' });
        }

        req.user = decoded; // Pass the full decoded token
        next();
    } catch (error) {
        console.error('Token verification error:', error); // Debug log
        res.status(401).json({ msg: 'Invalid token', error: error.message });
    }
};

module.exports = {
    verifyToken
};