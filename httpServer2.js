const express = require("express");
const app = express();
const PORT = 3001;

// Middleware to log incoming Request Metadata
app.use((req, res, next) => {
  console.log("--- NEW REQUEST RECEIVED ---");
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log("Headers:", req.headers); // This is your Request Metadata
  next();
});

app.use((req, res, next) => {
  // 1. We tell the browser WHO can access this server
  res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Change to your local HTML port

  // 2. We tell the browser WHAT methods are allowed
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  // 3. We tell the browser WHICH headers are allowed
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // HANDLE PREFLIGHT: If the method is OPTIONS, we stop here and send a 204 (No Content)
  if (req.method === "OPTIONS") {
    console.log("--- Preflight (OPTIONS) Received ---");
    return res.sendStatus(204);
  }

  next();
});

// A route demonstrating Content-Negotiation and Caching
app.get("/data", (req, res) => {
  // Setting Response Metadata (Headers)
  res.set({
    "Content-Type": "application/json",
    "Cache-Control": "public, max-age=60", // Tell browser to cache for 60s
    "X-Powered-By": "Best-Engineer-AI", // Custom Header
  });

  res.status(200).json({
    message: "This is the response body",
    note: "Check your network tab to see the headers and do not forget my coffee and doughnuts!",
  });
});

// A route demonstrating DELETE method
app.delete("/data", (req, res) => {
  console.log("--- Actual DELETE Request Received ---");
  res.json({ message: "Resource deleted successfully!" });
});
// A route demonstrating Status Codes
app.post("/create", (req, res) => {
  // 201 means "Created" - much better than a generic 200
  res.set("X-Response-ID", "resp-123");
  res.status(201).send({ message: "Resource Created Successfully" });
  res.status(201).json({ received: req.body });
  console.log("Body:", req.body);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
