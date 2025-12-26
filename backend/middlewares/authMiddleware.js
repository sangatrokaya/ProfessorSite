import jwt from "jsonwebtoken"; // Import jwt to verify JWT tokens
import Admin from "../models/Admin.js"; // Import Admin model to fetch authenticated admin from mongoDB

// Middleware to protect routes and allow only authenticated admins
export const protect = async (req, res, next) => {
  let token;
  // Check if authorization header exists and starts with "Bearer"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Extract token from header
      // Format: "Bearer <token>"
      token = req.headers.authorization.split(" ")[1];

      // Verify token using JWT secret from environment variables
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Fetch admin from database using ID from decoded token
      // Exclude password from the returned admin object
      req.admin = await Admin.findById(decoded.id).select("-password");

      if (!req.admin) {
        return res.status(401).json({ message: "Admin not found!" });
      }

      // Call next middleware or route handler
      next();
    } catch (error) {
      // If token verification fails, return 401 Unauthorized
      res.status(401).json({ message: "Not authorized, token failed!" });
    }
  }

  // If token is not provided in headers, return 401 Unauthorized
  if (!token) {
    res.status(401).json({ message: "Not authorized, no token!" });
  }
};
