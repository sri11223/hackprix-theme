const express = require("express");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require("../utility/db");
const errorMiddleware = require("../middleware/error-middleware"); 

// Load environment variables
dotenv.config();

const app = express();

// Security middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { msg: "Too many requests, please try again later" }
});

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false // Disable for API
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        const allowedOrigins = [
            'http://localhost:3000',
            'https://hackprix-theme.vercel.app',
            'https://hackprix-theme-git-main-sri11223.vercel.app',
            process.env.FRONTEND_URL
        ].filter(Boolean);
        
        // Allow any vercel.app subdomain for this project
        if (origin.includes('hackprix-theme') && origin.includes('vercel.app')) {
            return callback(null, true);
        }
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    optionsSuccessStatus: 200
}));

// Handle preflight requests
app.options('*', cors());

// Connect to database
connectDb().then(() => {
    console.log('MongoDB Connected');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Routes
const authrouter = require("../router/auth-router");
const contactrouter = require("../router/contact-router");
const foodrouter = require("../router/food-router");
const profilerouter = require("../router/profile-router");
const allRoutes = require("../router/all.routes");

app.use("/api/auth", authrouter);
app.use("/api/form", contactrouter);
app.use("/api/food", foodrouter);
app.use("/api/profile", profilerouter);
app.use('/', allRoutes); 

// Error handling middleware
app.use(errorMiddleware);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'API is running' });
});

module.exports = app;