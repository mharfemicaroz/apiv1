const express = require("express");
const { kv } = require("@vercel/kv");
require("dotenv").config(); // Ensure to load environment variables

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize KV client
const kvUrl = process.env.KV_URL;

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
    res.status(500).json({ error: error.message });
  }
});

// Route to get the access value from KV store
app.get("/", async (req, res) => {
  try {
    const value = await kv.get("access");
    if (value !== null) {
      res.status(200).json({ access: value });
    } else {
      res.status(404).json({ message: `Access value not found!` });
    }
  } catch (error) {
    console.error(`Error getting access: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
});

// Start the server on port 80
app.listen(80, () => {
  console.log(`Simple API listening at http://localhost`);
});

module.exports = app;
