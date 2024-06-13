// app.js
const express = require("express");
const app = express();

// Define a route that returns the JSON object
app.get("/", (req, res) => {
  res.json({ access: 0 });
});

// Start the server on port 80
app.listen(80, () => {
  console.log(`Simple API listening at http://localhost`);
});
