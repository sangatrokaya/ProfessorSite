import express from "express"; // Import express framework to create the backend server
import dotenv from "dotenv"; // Import dotenv to laod environment variables from .env file
import cors from "cors"; // Import cors middleware to allow cross-origin requests

// Load environment variable into process.env
dotenv.config();

// Create an Express application instance
const app = express();

// Enable CORS so frontend (different origin) can access this API
app.use(cors());

// Enable JSON body parsing for incoming requests
// Allows us to read req.body in POST/PUT requests
app.use(express.json());

// Root route to verify that the API server is running
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Define server port
// Uses PORT from environment variables if available, otherwise defaults to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is up and running on port ${PORT}`);
});
