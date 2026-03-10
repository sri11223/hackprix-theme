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

// Load environment variables
dotenv.config();

const app = express();
const server = createServer(app);

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

const io = new Server(server, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:3001", "http://localhost:3002"],
        methods: ["GET", "POST"],
        credentials: true,
    }
});

// Connected users map: { [userId]: { socketId, userType } }
const connectedUsers = {};

// Make io and connectedUsers available to controllers
app.set('io', io);
app.set('connectedUsers', connectedUsers);

// Security middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { msg: "Too many requests, please try again later" }
});

// Middleware
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({
    origin: function (origin, callback) {
        const allowed = [
            'http://localhost:3000',
            'http://localhost:3001',
            'http://localhost:3002',
        ];
        if (!origin || allowed.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use('/api/auth', limiter);

// Routes
const authrouter = require("./router/auth-router");
const profilerouter = require("./router/profile-router");
const startupRouter = require("./router/startup-router");
const jobRouter = require("./router/job-router");
const messageRouter = require("./router/message-router");
const investmentRouter = require("./router/investment-router");
const pitchRouter = require("./router/pitch-router");
const dashboardRouter = require("./router/dashboard-router");
const connectionRouter = require("./router/connection-router");

app.use("/api/auth", authrouter);
app.use("/api/profile", profilerouter);
app.use("/api/startups", startupRouter);
app.use("/api/jobs", jobRouter);
app.use("/api/messages", messageRouter);
app.use("/api/investments", investmentRouter);
app.use("/api/pitch-sessions", pitchRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/connections", connectionRouter);

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", connectedUsers: Object.keys(connectedUsers).length });
});

// ==================== Socket.io ====================
io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Register user with their userId
    socket.on("register", ({ userId, userType }) => {
        if (!userId) return;
        connectedUsers[userId] = { socketId: socket.id, userType };
        console.log(`User registered: ${userId} (${userType})`);

        // Broadcast online status to connections
        socket.broadcast.emit("userOnline", { userId });
    });

    // Real-time messaging
    socket.on("sendMessage", async ({ receiverId, content }) => {
        const senderEntry = Object.entries(connectedUsers).find(([, v]) => v.socketId === socket.id);
        if (!senderEntry) return;

        const [senderId] = senderEntry;
        const receiverSocket = connectedUsers[receiverId];
        if (receiverSocket) {
            io.to(receiverSocket.socketId).emit("newMessage", {
                sender: { id: senderId },
                content,
                timestamp: new Date(),
            });
        }
    });

    // Typing indicators
    socket.on("typing", ({ receiverId }) => {
        const senderEntry = Object.entries(connectedUsers).find(([, v]) => v.socketId === socket.id);
        if (!senderEntry) return;
        const [senderId] = senderEntry;
        const receiverSocket = connectedUsers[receiverId];
        if (receiverSocket) {
            io.to(receiverSocket.socketId).emit("userTyping", { userId: senderId });
        }
    });

    socket.on("stopTyping", ({ receiverId }) => {
        const senderEntry = Object.entries(connectedUsers).find(([, v]) => v.socketId === socket.id);
        if (!senderEntry) return;
        const [senderId] = senderEntry;
        const receiverSocket = connectedUsers[receiverId];
        if (receiverSocket) {
            io.to(receiverSocket.socketId).emit("userStoppedTyping", { userId: senderId });
        }
    });

    // Pitch arena - join room
    socket.on("joinPitchRoom", ({ sessionId, userId }) => {
        socket.join(`pitch_${sessionId}`);
        socket.to(`pitch_${sessionId}`).emit("participantJoined", { userId });
    });

    socket.on("leavePitchRoom", ({ sessionId, userId }) => {
        socket.leave(`pitch_${sessionId}`);
        socket.to(`pitch_${sessionId}`).emit("participantLeft", { userId });
    });

    // Pitch arena - chat within room
    socket.on("pitchChat", ({ sessionId, message }) => {
        socket.to(`pitch_${sessionId}`).emit("pitchChatMessage", message);
    });

    // Pitch arena - reactions
    socket.on("pitchReaction", ({ sessionId, reaction }) => {
        io.to(`pitch_${sessionId}`).emit("pitchReactionReceived", reaction);
    });

    // Handle disconnections
    socket.on("disconnect", () => {
        const entry = Object.entries(connectedUsers).find(([, v]) => v.socketId === socket.id);
        if (entry) {
            const [userId] = entry;
            delete connectedUsers[userId];
            socket.broadcast.emit("userOffline", { userId });
            console.log(`User disconnected: ${userId}`);
        }
    });
});

// Error handling middleware
app.use(errorMiddleware);

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

// Start server
connectDb().then(() => {
    console.log('MongoDB Connected');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Frontend URL: ${FRONTEND_URL}`);
    });
}).catch(err => {
    console.error('Failed to connect to MongoDB:', err);
    process.exit(1);
});
