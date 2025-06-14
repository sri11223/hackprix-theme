const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDb = require("./utility/db");
const errorMiddleware = require("./middleware/error-middleware"); 
const redis = require('./utility/redis');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000" }
});

// Security middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { msg: "Too many requests, please try again later" }
});

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            connectSrc: ["'self'", process.env.FRONTEND_URL]
        }
    }
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api/auth', limiter); // Apply rate limiting to auth routes

// Routes
const authrouter = require("./router/auth-router");
const contactrouter = require("./router/contact-router");
const foodrouter = require("./router/food-router"); // Pass io
const profilerouter = require("./router/profile-router");

app.use("/api/auth", authrouter);
app.use("/api/form", contactrouter);
app.use("/api/food", foodrouter);
app.use("/api/profile", profilerouter);


// Socket.io setup
const users = {}; // Store connected users
const ngorouter = require("./router/ngo-router")(io,users);
app.use("/api/ngo", ngorouter);
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Register user (NGO or Institute)
    socket.on("register", ({ userId, userType }) => {
        users[userId] = { socketId: socket.id, userType };
        console.log("User registered:", users);
    });

    // Handle disconnections
    socket.on("disconnect", () => {
        console.log("A user disconnected:", socket.id);
        Object.keys(users).forEach((key) => {
            if (users[key].socketId === socket.id) {
                delete users[key]; // Remove user on disconnect
            }
        });
    });
});

// Swagger documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Error handling middleware should be after all routes
app.use(errorMiddleware);

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.info('SIGTERM signal received.');
    server.close(() => {
        console.log('Server closed.');
        process.exit(0);
    });
});

// Add after your MongoDB connection
connectDb().then(() => {
    console.log('MongoDB Connected');
    server.listen(process.env.PORT || 5000, () => {
        console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
});
