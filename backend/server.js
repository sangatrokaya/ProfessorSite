import express from "express"; // Import express framework to create the backend server
import dotenv from "dotenv"; // Import dotenv to laod environment variables from .env file
import cors from "cors"; // Import cors middleware to allow cross-origin requests
import connectDB from "./config/db.js"; // To connect DB and server
import authRoutes from "./routes/authRoutes.js"; // Import your auth routes
import adminRoutes from "./routes/adminRoutes.js"; // Import your admin dahboard routes
import paperRoutes from "./routes/paperRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import videoRoutes from "./routes/videoRoutes.js";
// Load environment variable into process.env
dotenv.config();

// Create an Express application instance
const app = express();

/* --------------- GLOBAL MIDDLEWARES ----------------- */

// Enable CORS so frontend (different origin) can access this API
app.use(cors());

// Enable JSON body parsing for incoming requests
// Allows us to read req.body in POST/PUT requests
app.use(express.json());

/* --------------- ROUTES ----------------------- */

// Mount auth routes at /api/auth
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/videos", videoRoutes);
/* ------- Root test route (optional) ------------- */

// Root route to verify that the API server is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

/* ------ Function to start server only after DB connection -------- */
const startServer = async () => {
  try {
    // Connect to mongoDB first
    await connectDB();

    // Define server port
    // Uses PORT from environment variables if available, otherwise defaults to 5000
    const PORT = process.env.PORT || 5000;

    // Start server only if DB connection is successful
    // Server listen for incoming requests
    app.listen(PORT, () => {
      console.log(`Server is up and running on port ${PORT}`);
    });
  } catch (error) {
    console.log("Failed to start server:", error.message);
    process.exit(1); // Exit if DB connection fails
  }
};

// Start the application
startServer();
