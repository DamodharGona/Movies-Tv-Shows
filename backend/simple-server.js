import http from "http";

const server = http.createServer((req, res) => {
  // Handle all routes
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });

  res.end(
    JSON.stringify({
      status: "ok",
      message: "Simple server is running",
      timestamp: new Date().toISOString(),
      url: req.url,
      method: req.method,
    })
  );
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Simple server running on port ${PORT}`);
});

export default server;
