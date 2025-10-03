// Note: Socket.io doesn't work with Vercel serverless functions
// For real-time features, consider using:
// 1. Vercel Edge Functions with WebSockets (beta)
// 2. External WebSocket service (like Pusher, Ably)
// 3. Server-Sent Events (SSE)
// 4. Polling mechanism

// This file documents the socket.io implementation that would need
// to be deployed separately on a platform that supports persistent connections
// like Railway, Heroku, or AWS EC2

const { Server } = require("socket.io");

function setupSocketIO(server) {
    const io = new Server(server, {
        cors: { origin: process.env.FRONTEND_URL || "http://localhost:3000" }
    });

    const users = {}; // Store connected users

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

    return { io, users };
}

module.exports = setupSocketIO;