import express from "express"; // Import express to create router instance
import { protect } from "../middlewares/authMiddleware.js"; // Import authentication middleware to protect admin routes

// Create a new express router
const router = express.Router();

// Protected admin dashboard route
// Only accessible if a valid JWT token is provided
router.get("/dashboard", protect, (req, res) => {
  res.json({
    // Response message for successful authentication
    message: "Welcome to Admin Dashboard",

    // Admin data attached to request object by protect middleware
    admin: req.admin,
  });
});

// Export router to be used in server.js
export default router;
