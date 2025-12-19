import jwt from "jsonwebtoken"; // to create and sign JWT tokens

// Function to generate a JWT for authentication
// Accepts user/admin ID as payload
const generateToken = (id) => {
  return jwt.sign(
    // Payload: data stored inside the token
    { id },
    // Secret key used to sign and verify the token
    process.env.JWT_SECRET,
    // Token configuration options
    {
      expiresIn: "30d", // Token expiration time (valid for 30 days)
    }
  );
};

// Export function to use in authentication controllers
export default generateToken;
