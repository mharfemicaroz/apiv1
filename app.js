const express = require("express");
const app = express();

const whitelistedIPs = ["216.247.50.17"];

app.use((req, res, next) => {
  let ipAddress =
    req.headers["x-forwarded-for"] || req.connection.remoteAddress;

  if (ipAddress && ipAddress.includes(",")) {
    ipAddress = ipAddress.split(",")[0].trim();
  }

  if (ipAddress.startsWith("::ffff:")) {
    ipAddress = ipAddress.substring(7);
  }

  console.log(`Resolved IP address: ${ipAddress}`);

  if (!whitelistedIPs.includes(ipAddress)) {
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
