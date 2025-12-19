import mongoose from "mongoose"; // mongoose to define schema and interact with MongoDB
import bcrypt from "bcryptjs"; // bcryptjs to securely hash and compare passwords

// Define Admin schema with fields and validation rules
const adminSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // Prevents duplicate admin accounts
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      default: "admin",
    },
  },
  {
    timestamps: true, // Automaticallt adds createdAt and updatedAt timestamps
  }
);

// Create Admin model from schema
const Admin = mongoose.model("Admin", adminSchema);

// Export model to use in controllers and services
export default Admin;
