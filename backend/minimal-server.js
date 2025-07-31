import http from "http";

const server = http.createServer((req, res) => {
  console.log(`${req.method} ${req.url}`);
  
  res.writeHead(200, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "*",
    "Access-Control-Allow-Headers": "*"
  });
  
  res.end(JSON.stringify({
    status: "ok",
    message: "Minimal server is running",
    timestamp: new Date().toISOString(),
    url: req.url,
    method: req.method
  }));
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, "0.0.0.0", () => {
  console.log(`Minimal server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Port: ${PORT}`);
  console.log(`Host: 0.0.0.0`);
});

export default server; 