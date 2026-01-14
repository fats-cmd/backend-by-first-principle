// Simple Node.js HTTP server
// Run: node httpServer.js

const http = require("http");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  const { method, url } = req;
  console.log(`${new Date().toISOString()} - ${method} ${url}`);

  if (method === "GET" && url === "/") {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Hello, world!\n");
    return;
  }

  if (method === "GET" && url === "/json") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Hello, world!" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "text/plain" });
  res.end("Not found\n");
});

server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("Shutting down server...");
  server.close(() => process.exit(0));
});
