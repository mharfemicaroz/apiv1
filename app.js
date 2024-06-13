const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const app = express();

// Initialize the database connection
const db = new sqlite3.Database("database.db");

// Define a route that returns the JSON object with the access value from the database
app.get("/", (req, res) => {
  db.get("SELECT access FROM config", (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json({ access: row.access });
  });
});

// Define a route to toggle the access value
app.get("/toggle-access", (req, res) => {
  db.get("SELECT access FROM config", (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const newAccessValue = row.access === 1 ? 0 : 1;
    db.run("UPDATE config SET access = ?", [newAccessValue], (err) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ access: newAccessValue });
    });
  });
});

// Start the server on port 80
app.listen(80, () => {
  console.log(`Simple API listening at http://localhost`);
});

module.exports = app;
