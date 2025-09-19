// src/server.js

// --- Imports ---
// Environment variables
// This MUST be the first line
import 'dotenv/config';


console.log("Checking for API Key:", process.env.OPENAI_API_KEY);

// Core Node.js module for creating HTTP servers
import http from 'http';
// The main Express framework
import express from 'express';
// Middleware for handling Cross-Origin Resource Sharing
import cors from 'cors';
// Middleware for parsing cookies
import cookieParser from 'cookie-parser';

// --- Local Imports ---
// Database connection logic
import connectDB from './config/db.js';
// Socket.IO initialization logic
import { initializeSocketIO } from './sockets/index.js';
// Custom logger for application events
import logger from './utils/logger.js';
// Cron jobs for scheduled tasks
import { dailyResetJob } from './jobs/dailyResetJob.js';
import { dailyHealthCheckJob } from './jobs/healthCheckJob.js';
import { dailyStreakResetJob } from './jobs/streaksJob.js';


// --- Initial Configuration ---
// Load environment variables from the .env file at the very beginning



// --- App & Server Initialization ---
const app = express();
// Create an HTTP server instance that uses the Express app to handle requests.
// This allows both Express and Socket.IO to run on the same server and port.
const server = http.createServer(app);


// --- Socket.IO Initialization ---
// Pass the HTTP server to the Socket.IO initializer
initializeSocketIO(server);


// --- Core Middlewares ---
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}));
// Middleware to parse incoming JSON payloads
app.use(express.json({ limit: "16kb" }));
// Middleware to parse URL-encoded data (from forms)
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// Middleware to serve static files (e.g., images) from the 'public' folder
app.use(express.static("public"));
// Middleware to parse and manage cookies
app.use(cookieParser());


// --- Route Imports ---
import authRouter from './routes/authRoutes.js';
import userRouter from './routes/userRoutes.js';
import adminRouter from './routes/adminRoutes.js';
import plantRouter from './routes/plantRoutes.js';
import tasksRouter from './routes/TaskRoutes.js';
import moodRouter from './routes/moodRoutes.js';
import journalRouter from './routes/journalRoutes.js';
import breathingRouter from './routes/breathingRoutes.js';
import voiceRouter from './routes/voiceRoutes.js';
import chatRouter from './routes/chatRoute.js';
import storeRouter from './routes/storeRoute.js';
import musicRouter from './routes/musicRoutes.js'; // The new music route


// --- Route Declarations ---
// Mount the imported routers to their specific base paths
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/plant", plantRouter);
app.use("/api/v1/tasks", tasksRouter);
app.use("/api/v1/mood", moodRouter);
app.use("/api/v1/journal", journalRouter);
app.use("/api/v1/breathing", breathingRouter);
app.use("/api/v1/voice", voiceRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/store", storeRouter);
app.use("/api/v1/music", musicRouter); // The new music route


// --- Main Execution Block ---
// This block connects to the database and then starts the server.
connectDB()
.then(() => {
    // Start listening for incoming requests on the specified port
    server.listen(process.env.PORT || 8000, () => {
        logger.info(`✅ Server is running at port: ${process.env.PORT}`);
    });

    // Start all the scheduled cron jobs after the server is running
    dailyResetJob.start();
    dailyHealthCheckJob.start();
    dailyStreakResetJob.start();
    logger.info("⏰ Cron jobs started successfully.");
})
.catch((err) => {
    // Log a critical error if the database connection fails
    logger.error("MONGO db connection failed !!! ", err);
    process.exit(1); // Exit the process with an error code
});