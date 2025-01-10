const express = require("express");
const app = express();

// Example list of blacklisted IPs
const blacklistedIPs = [
  "192.168.1.1", // Example blacklisted IP
  "203.0.113.42", // Example blacklisted IP
  // Add more blacklisted IPs here
];

// Middleware to log the IP address of the request and check against blacklist
app.use((req, res, next) => {
  // Vercel uses a proxy, so we need to check the X-Forwarded-For header for the real client IP
  let ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // If there are multiple IPs in the x-forwarded-for header (comma-separated), get the first one
  if (ipAddress && ipAddress.includes(",")) {
    ipAddress = ipAddress.split(",")[0].trim();
  }

  // Handle IPv6 addresses (remove '::ffff:' prefix if it's an IPv4 address in IPv6 format)
  if (ipAddress.startsWith("::ffff:")) {
    ipAddress = ipAddress.substring(7); // Remove the "::ffff:" part
  }

  // Log the resolved IP for debugging
  console.log(`Resolved IP address: ${ipAddress}`);

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
