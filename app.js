const express = require("express");
const { kv } = require("@vercel/kv");
require("dotenv").config(); // Ensure to load environment variables
const cors = require("cors");

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Initialize KV client
const kvUrl = process.env.KV_URL;

if (!kvUrl) {
  console.error("KV_URL environment variable not set");
  process.exit(1);
}

// Route to set the access value in KV store
app.post("/set", async (req, res) => {
  const { value } = req.body;
  if (value !== 0 && value !== 1) {
    return res.status(400).json({ error: "Value must be 0 or 1" });
  }
  try {
    await kv.set("access", value);
    res.status(200).json({ message: `Access set to ${value} successfully!` });
  } catch (error) {
    console.error(`Error setting access: ${error.message}`);
    res.status(500).json({ error: `Error setting access: ${error.message}` });
  }
});

// Route to get the access value from KV store
app.get("/", async (req, res) => {
  try {
    const value = await kv.get("access");
    if (value !== null) {
      res.status(200).json({ access: value });
    } else {
      res.status(404).json({ message: "Access value not found!" });
    }
  } catch (error) {
    console.error(`Error getting access: ${error.message}`);
    res.status(500).json({ error: `Error getting access: ${error.message}` });
  }
});

// Start the server on the specified port, default to 80
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Simple API listening at http://localhost:${PORT}`);
});

module.exports = app;
