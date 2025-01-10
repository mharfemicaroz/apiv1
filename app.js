const express = require("express");
const app = express();

// Example list of blacklisted IPs
const blacklistedIPs = [
  "192.168.1.1", // Example blacklisted IP
  "120.28.196.158", // Example blacklisted IP
  // Add more blacklisted IPs here
];

// Middleware to log the IP address of the request and check against blacklist
app.use((req, res, next) => {
  // Vercel uses a proxy, so we need to check the X-Forwarded-For header for the real client IP
  const ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  console.log(`Request received from IP address: ${ipAddress}`);

  // Check if the IP address is blacklisted
  if (blacklistedIPs.includes(ipAddress)) {
    // If the IP is blacklisted, deny access
    return res.json({ access: 0 });
  }

  // If the IP is not blacklisted, allow access
  next();
});

// Define a route that returns the JSON object
app.get("/", (req, res) => {
  res.json({ access: 1 });
});

// Periodic logging every 5 seconds
setInterval(() => {
  console.log(`Server is running and monitoring requests...`);
}, 5000);

// Vercel does not need you to specify an IP or port, the platform handles it for you
// The app is automatically accessible through the provided Vercel URL: https://apiv1-phi.vercel.app/
app.listen(3000, () => {
  console.log("Simple API listening on port 3000");
});

module.exports = app;
