import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import { config, validateConfig } from './config/env';
import ga4Routes from './routes/ga4Routes';

// Initialize express app
const app = express();

// Validate configuration
if (!validateConfig()) {
  console.error('Invalid configuration. Exiting...');
  process.exit(1);
}

// Middleware
app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/ga4', ga4Routes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'ga4-server',
  });
});

// Test page route
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'test.html'));
});

// Start server
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GA4 Measurement ID: ${config.ga4.measurementId}`);
  console.log(`Server endpoint: ${config.server.endpoint}`);
  console.log(`Test page: http://localhost:${PORT}/test`);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
}); 