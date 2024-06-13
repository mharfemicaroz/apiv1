// app.js
const express = require("express");
const app = express();
const port = 3000;

// Define a route that returns the JSON object
app.get("/", (req, res) => {
  res.json({ access: 0 });
});

// Start the server
app.listen(port, () => {
  console.log(`Simple API listening at http://localhost:${port}`);
});
