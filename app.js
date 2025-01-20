const express = require("express");
const app = express();

// Define whitelisted IPs and ranges
const whitelistedIPs = ["49.146.2.227"]; // Add specific IPs
const whitelistedIPRanges = [
  "216.247.50.",
  "49.146.2.",
  "61.245.13.",
  "222.127.28.",
]; // Add ranges (e.g., 216.247.50.xxx)

// Middleware to check IP addresses
app.use((req, res, next) => {
  let ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Extract the first IP if behind a proxy
  if (ipAddress && ipAddress.includes(",")) {
    ipAddress = ipAddress.split(",")[0].trim();
  }

  // Remove IPv6 prefix if present
  if (ipAddress.startsWith("::ffff:")) {
    ipAddress = ipAddress.substring(7);
  }

  console.log(`Resolved IP address: ${ipAddress}`);

  // Check if IP is in the whitelist
  const isWhitelisted =
    whitelistedIPs.includes(ipAddress) ||
    whitelistedIPRanges.some((range) => ipAddress.startsWith(range));

  if (!isWhitelisted) {
    console.log(`Attempted connection from non-whitelisted IP: ${ipAddress}`);
    return res.json({ access: 0 });
  }

  next();
});

app.get("/", (req, res) => {
  res.json({ access: 1 });
});

setInterval(() => {
  console.log(`Server is running and monitoring requests...`);
}, 5000);

app.listen(3000, () => {
  console.log("Simple API listening on port 3000");
});

module.exports = app;
