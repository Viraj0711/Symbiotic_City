import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';

// Import database connection
import connectDB from './config/database';

// Import routes
import authRoutes from './routes/auth';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept', 'Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    database: 'MongoDB',
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);

// 404 handler - must come after all routes
app.use((req, res) => {
  res.status(404).json({
    error: 'Resource not found',
    message: `Cannot ${req.method} ${req.originalUrl}`,
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware - must come last
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  
  // MongoDB validation errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({
      error: 'Validation Error',
      details: errors
    });
  }
  
  // MongoDB duplicate key errors
  if (err.code === 11000) {
    return res.status(409).json({
      error: 'Duplicate field value entered'
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'Invalid token'
    });
  }
  
  // Default error
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  });
});

// Create HTTP server
const server = createServer(app);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🔴 SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('💀 Process terminated');
  });
});

// Start server
server.listen(PORT, () => {
  console.log('🚀=================================🚀');
  console.log(`🚀  Server running on port ${PORT}  🚀`);
  console.log(`📱  Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌍  CORS origin: ${process.env.CORS_ORIGIN || 'http://localhost:5173'}`);
  console.log(`🗄️   Database: MongoDB`);
  console.log('🚀=================================🚀');
});

export default app;
