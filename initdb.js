const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("database.db");

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS config (access INTEGER)", (err) => {
    if (err) {
      console.error("Error creating table:", err);
      return;
    }

    // Check if the table is empty
    db.get("SELECT COUNT(*) as count FROM config", (err, row) => {
      if (err) {
        console.error("Error querying table:", err);
        return;
      }

      if (row.count === 0) {
        // Insert a default value if the table is empty
        db.run("INSERT INTO config (access) VALUES (1)", (err) => {
          if (err) {
            console.error("Error inserting default value:", err);
            return;
          }

          console.log("Default value inserted.");
          db.close((err) => {
            if (err) {
              console.error("Error closing database:", err);
            } else {
              console.log("Database connection closed.");
            }
          });
        });
      } else {
        console.log("Table already has data.");
        db.close((err) => {
          if (err) {
            console.error("Error closing database:", err);
          } else {
            console.log("Database connection closed.");
          }
        });
      }
    });
  });
});
