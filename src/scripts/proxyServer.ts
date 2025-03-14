import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';

// Get ports from environment variables
const SOURCE_PORT = parseInt(process.env.SOURCE_PORT || '3001', 10);
const TARGET_PORT = parseInt(process.env.TARGET_PORT || '3002', 10);

// Create Express server
const app = express();

// Configure proxy middleware
const apiProxy = createProxyMiddleware({
  target: `http://localhost:${TARGET_PORT}`,
  changeOrigin: true,
  ws: true, // proxy websockets
  logLevel: 'debug'
});

// Use proxy for all requests
app.use('/', apiProxy);

// Start the proxy server
app.listen(SOURCE_PORT, () => {
  console.log(`Proxy server running on port ${SOURCE_PORT}`);
  console.log(`Forwarding requests to http://localhost:${TARGET_PORT}`);
}); 