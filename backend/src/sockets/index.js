// src/socket/index.js
import { Server } from "socket.io";
import { authenticateSocket } from "./socket.middleware.js";
import registerBreathingHandlers from "./breathing.handler.js";

let io = null;

const initializeSocketIO = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: process.env.CORS_ORIGIN, // Your frontend URL
            credentials: true
        }
    });

    // Use a middleware to handle JWT authentication for every socket connection
    io.use(authenticateSocket);

    io.on("connection", (socket) => {
        console.log(`🔌 User connected: ${socket.user.username} (ID: ${socket.id})`);

        // Join a private room based on the user's ID
        // This allows us to send notifications to a specific user
        socket.join(socket.user._id.toString());

        // Register all breathing-related event handlers for this socket
        registerBreathingHandlers(io, socket);

        socket.on("disconnect", () => {
            console.log(`🔌 User disconnected: ${socket.user.username} (ID: ${socket.id})`);
        });
    });
};

// Function to get the io instance from other files (like services)
const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO not initialized!");
    }
    return io;
};

export { initializeSocketIO, getIO };