const express = require("express");
const app = express();
const PORT = 3001;

const ALLOWED_ORIGINS = [
  "http://127.0.0.1:5500",
  " http://localhost:5173",
  "http://10.110.83.162:3000",
  "http://127.0.0.1:5501",
];

// custom cors
const customCors = (req, res, next) => {
  const origin = req.headers.origin;

  // dynamic origin check
  // if the origin is allowed it is passed on the the header
  if (ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }

  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    console.log(
      `>>> Handling Preflight for: ${req.headers["access-control-request-method"]}`
    );

    // Tell the browser what we allow
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-Custom-Header"
    );

    // Cache the preflight for 10 minutes (saves performance)
    res.setHeader("Access-Control-Max-Age", "600");

    return res.sendStatus(204); // "No Content" is the standard for success
  }

  next();
};

// Middleware to log incoming Request Metadata
app.use((req, res, next) => {
  console.log("--- NEW REQUEST RECEIVED ---");
  console.log(`Method: ${req.method}`);
  console.log(`URL: ${req.url}`);
  console.log("Headers:", req.headers); // This is your Request Metadata
  next();
});

// app.use((req, res, next) => {
//   // 1. We tell the browser WHO can access this server
//   res.setHeader("Access-Control-Allow-Origin", "http://127.0.0.1:5500"); // Change to your local HTML port

//   // 2. We tell the browser WHAT methods are allowed
//   res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

//   // 3. We tell the browser WHICH headers are allowed
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

//   // HANDLE PREFLIGHT: If the method is OPTIONS, we stop here and send a 204 (No Content)
//   if (req.method === "OPTIONS") {
//     console.log("--- Preflight (OPTIONS) Received ---");
//     return res.sendStatus(204);
//   }

//   next();
// });

app.use(customCors);

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

// post request to /data route
app.post("/data", (req, res) => {
  console.log("request received");
  res.json({ message: "form submitted successfully" });
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
