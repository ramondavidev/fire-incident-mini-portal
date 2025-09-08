import express from 'express';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { config } from 'dotenv';
import { logger } from './utils/logger';

import incidentRoutes from './routes/incidents';
import { swaggerSpec } from './swagger/spec';
import {
  helmetConfig,
  corsConfig,
  hppConfig,
  bruteForceProtection,
} from './middleware/security';

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security Middleware (order matters!)
app.use(helmetConfig); // Secure headers first
app.use(corsConfig); // CORS configuration
app.use(hppConfig); // HTTP Parameter Pollution protection
app.use(bruteForceProtection); // Rate limiting and brute force protection

// Body parsing middleware with size limits
app.use(express.json({ limit: '1mb' })); // Cap request body size
app.use(express.urlencoded({ extended: true, limit: '1mb' }));

// Serve uploaded files statically
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), process.env.UPLOAD_DIR || 'uploads'))
);

// API Routes
app.use('/api/incidents', incidentRoutes);

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Health check
app.get('/health', (req, res) => {
  logger.info('Health check requested');
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server
app.listen(PORT, () => {
  logger.info(`Fire Incident API server started`, {
    port: PORT,
    url: `http://localhost:${PORT}`,
    docsUrl: `http://localhost:${PORT}/api-docs`,
  });
  console.log(
    `🔥 Fire Incident API server running on http://localhost:${PORT}`
  );
  console.log(
    `📚 API documentation available at http://localhost:${PORT}/api-docs`
  );
});
