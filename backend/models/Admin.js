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

// Mongoose middleware: runs before saving a document
// used here to hash the password securely
adminSchema.pre("save", async function (next) {
  // If password is not modified, skip hashing
  if (!this.isModified("password")) {
    return next();
  }
  //   Generate salt for hashing
  const salt = await bcrypt.genSalt(10);

  //   Hash the pasword and tore it in the database
  this.password = await bcrypt.hash(this.password, salt);
});

// Instance method to compare entered password with hashed password
// Used during login authentication
adminSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create Admin model from schema
const Admin = mongoose.model("Admin", adminSchema);

// Export model to use in controllers and services
export default Admin;
