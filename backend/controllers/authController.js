import Admin from "../models/Admin.js"; // to interact with admin collection in mongodb
import generateToken from "../utils/generateToken.js"; // import jwt token generator utility

// Controller function to handle admin login
export const adminLogin = async (req, res) => {
  // Destructure email and password from request body
  const { email, password } = req.body;

  //   Find admin in the database by email
  const admin = await Admin.findOne({ email });

  // Check if admin exists and password matches
  // matchPassword is a method defined in the Admin model using bcrypt
  if (admin && (await admin.matchPassword(password))) {
    // If valid, respond with admin details and JWT token
    res.josn({
      _id: admin._id,
      name: admin.name,
      email: admin.email,
      token: generateToken(admin._id), // Generate JWT for authentication
    });
  } else {
    // If email or password is invalid, return 401 Unauthorized
    res.status(401).json({ message: "invalid email or password" });
  }
};
