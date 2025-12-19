import mongoose from "mongoose"; // for mongodb interaction
import dotenv from "dotenv"; // to load environment variables from .env
import Admin from "../models/Admin.js"; // to interact with admin model
import connectDB from "../config/db.js"; // connect mongodb and server

// Load environment variables
dotenv.config();

// Establish mongodb connection
connectDB();

// Function to seed an initial admin account into the database
const seedAdmin = async () => {
  try {
    // Check if admin already exists using the email
    const adminExists = await Admin.findOne({
      email: "professor@university.edu",
    });

    // Prevent duplicate admin creation
    if (adminExists) {
      console.log("Admin already exists!");
      process.exit(); // Exit script successfully
    }

    // Create default admin account
    // Password will be hashed automatically by mongoose middleware
    await Admin.create({
      name: "Asst. Prof. Bhim Rokaya",
      email: "professor@university.edu",
      password: "Admin@000",
    });

    // Log success message
    console.log("Admin created successfully!");

    // Exit script after successful execution
    process.exit();
  } catch (error) {
    console.log(error); // Log error if seeding fails
    process.exit(1); // Exit script with failure code
  }
};

seedAdmin();
