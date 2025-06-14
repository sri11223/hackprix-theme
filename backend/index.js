const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
const connectDb = require("./utility/db");

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: { origin: "*" }
});

const authrouter = require("./router/auth-router");
const contactrouter = require("./router/contact-router");
const foodrouter = require("./router/food-router"); // Pass io

const errorMiddleware = require("./middleware/error-middleware");

app.use(express.json());
app.use(cors());
app.use(errorMiddleware);

// Use routers
app.use("/api/auth", authrouter);
app.use("/api/form", contactrouter);
app.use("/api/food", foodrouter);


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

connectDb().then(() => {
    server.listen(5000, () => {
        console.log("Server running on port 5000");
    });
});
