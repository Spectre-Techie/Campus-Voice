import express, { type Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { env } from './config/env';
import prisma, { withRetry } from './config/database';
import { apiLimiter } from './middleware/rateLimiter';
import { errorHandler } from './middleware/errorHandler';
import feedbackRoutes from './routes/feedback.routes';
import statsRoutes from './routes/stats.routes';
import adminRoutes from './routes/admin.routes';
import uploadRoutes from './routes/upload.routes';

// Load environment variables
dotenv.config();

const app: Express = express();

// Trust the first proxy (Render, Railway, etc.)
app.set('trust proxy', 1);

// ---------------------
// Global Middleware
// ---------------------
app.use(helmet());
app.use(cors({
  origin: env.CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use('/api', apiLimiter);

// ---------------------
// Health Check
// ---------------------
app.get('/api/health', async (_req, res) => {
  try {
    await withRetry(() => prisma.$queryRaw`SELECT 1`);
    res.status(200).json({
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  } catch {
    res.status(503).json({
      status: 'degraded',
      database: 'disconnected',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
});

// ---------------------
// Routes
// ---------------------
app.use('/api/feedback', feedbackRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// ---------------------
// 404 Handler
// ---------------------
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Route not found' },
  });
});

// ---------------------
// Global Error Handler
// ---------------------
app.use(errorHandler);

// ---------------------
// Start Server
// ---------------------
const PORT = env.PORT;

app.listen(PORT, async () => {
  console.log(`\n🚀 CampusVoice API Server`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   Port:        ${PORT}`);
  console.log(`   Health:      http://localhost:${PORT}/api/health`);

  // Warm up database connection (non-blocking)
  try {
    await prisma.$connect();
    console.log('   Database:    ✅ connected\n');
  } catch {
    console.warn('   Database:    ⚠️  connection failed (will retry on request)\n');
  }
});

export default app;
