const express = require("express");
const app = express();

// Define exact whitelisted IPs with alias and sched
// sched: true => must respect schedule; false => allowed anytime
const whitelistedIPs = [
  { ip: "49.146.2.227", sched: true, alias: "my-home-ip" },
  { ip: "192.168.1.100", sched: false, alias: "internal-network" },
];

// Define whitelisted IP ranges with alias and sched
const whitelistedIPRanges = [
  { ip: "216.247.50.", sched: true, alias: "pc-server" },
  { ip: "49.146.2.", sched: false, alias: "ndci" },
  { ip: "61.245.13.", sched: true, alias: "cdn" },
];

// Function to determine if the current time is within any allowed time window
function scheduledIpRange() {
  // Define your allowed time windows here
  const schedule = [
    { start: "09:00", end: "10:00" },
    { start: "11:00", end: "12:00" },
    { start: "14:00", end: "15:00" },
    { start: "16:00", end: "17:00" },
  ];

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (const interval of schedule) {
    const [startHour, startMinute] = interval.start.split(":").map(Number);
    const [endHour, endMinute] = interval.end.split(":").map(Number);

    const startTotal = startHour * 60 + startMinute;
    const endTotal = endHour * 60 + endMinute;

    if (currentMinutes >= startTotal && currentMinutes < endTotal) {
      return true;
    }
  }

  return false;
}

// Middleware to check IP addresses, whitelisting, and schedules
app.use((req, res, next) => {
  let ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  // Extract the first IP if multiple are present
  if (ipAddress && ipAddress.includes(",")) {
    ipAddress = ipAddress.split(",")[0].trim();
  }

  // Remove IPv6 prefix if present
  if (ipAddress.startsWith("::ffff:")) {
    ipAddress = ipAddress.substring(7);
  }

  console.log(`Resolved IP address: ${ipAddress}`);

  // 1. Check if there's an EXACT match in whitelistedIPs
  const matchingExact = whitelistedIPs.find((obj) => obj.ip === ipAddress);
  if (matchingExact) {
    // If scheduling is required for this exact IP
    if (matchingExact.sched) {
      if (!scheduledIpRange()) {
        console.log(
          `Attempted connection outside schedule from EXACT IP: ${matchingExact.alias} (${ipAddress})`
        );
        return res.json({ access: 0 });
      }
    }
    // If sched = false or we passed schedule check, allow access
    console.log(
      `Connection allowed from EXACT IP: ${matchingExact.alias} (${ipAddress})`
    );
    return next();
  }

  // 2. If no exact match, check IP ranges
  const matchingRange = whitelistedIPRanges.find((rangeObj) =>
    ipAddress.startsWith(rangeObj.ip)
  );

  if (!matchingRange) {
    // IP not in any whitelisted range
    console.log(`Attempted connection from non-whitelisted IP: ${ipAddress}`);
    return res.json({ access: 0 });
  }

  // If found a matching range, check scheduling
  if (matchingRange.sched) {
    if (!scheduledIpRange()) {
      console.log(
        `Attempted connection outside schedule from RANGED IP: ${matchingRange.alias} (${ipAddress})`
      );
      return res.json({ access: 0 });
    }
  }

  // If sched is false or it's within schedule, allow
  console.log(
    `Connection allowed from RANGED IP: ${matchingRange.alias} (${ipAddress})`
  );
  next();
});

// Sample route
app.get("/", (req, res) => {
  res.json({ access: 1 });
});

// Just for demonstration logs
setInterval(() => {
  console.log("Server is running and monitoring requests...");
}, 5000);

app.listen(3000, () => {
  console.log("Simple API listening on port 3000");
});

module.exports = app;
