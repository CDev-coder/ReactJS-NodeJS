let http = require("http");

console.log("Script starting..."); // This should appear immediately

http
  .createServer(function (req, res) {
    console.log("Request received:", req.url); // This appears on each request
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("Hello World!");
  })
  .listen(3000, () => {
    console.log("Server running at http://127.0.0.1:3000/"); // Moved inside callback
  });

global.mylet = 42;
console.log("Global variable set:", global.mylet);
console.log("UPDATED");

const name = "Node.js";
console.log(`Hello, ${name}!`);

console.log("Environment:", process.env.NODE_ENV || "development");
console.log("Custom variable:", process.env.MY_VARIABLE);
console.log("Database URL:", process.env.DATABASE_URL || "Not set");

const v8 = require("v8");
const heapStats = v8.getHeapStatistics();

console.log(
  "Heap size limit:",
  (heapStats.heap_size_limit / 1024 / 1024).toFixed(2),
  "MB",
);
console.log(
  "Total heap size:",
  (heapStats.total_heap_size / 1024 / 1024).toFixed(2),
  "MB",
);
console.log(
  "Used heap size:",
  (heapStats.used_heap_size / 1024 / 1024).toFixed(2),
  "MB",
);
