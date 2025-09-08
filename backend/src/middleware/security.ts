import helmet from 'helmet';
import {
  RateLimiterMemory,
  RateLimiterRedis,
  RateLimiterRes,
} from 'rate-limiter-flexible';
import hpp from 'hpp';
import cors from 'cors';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// Rate limiter configuration
const rateLimiterOptions = {
  points: 200, // Number of requests (increased from 100)
  duration: 900, // Per 15 minutes (900 seconds)
  blockDuration: 300, // Block for 5 minutes (reduced from 15 minutes)
};

// Create rate limiter (fallback to memory if Redis not available)
let rateLimiter: RateLimiterMemory | RateLimiterRedis;

try {
  // In production, you would configure Redis connection here
  // For now, using memory-based rate limiter
  rateLimiter = new RateLimiterMemory(rateLimiterOptions);
  logger.info('Rate limiter initialized with memory store');
} catch (error) {
  logger.error('Failed to initialize rate limiter', { error });
  rateLimiter = new RateLimiterMemory(rateLimiterOptions);
}

// Stricter rate limiter for auth endpoints
const authRateLimiter = new RateLimiterMemory({
  points: 20, // 20 attempts (increased from 5)
  duration: 900, // Per 15 minutes
  blockDuration: 600, // Block for 10 minutes (reduced from 1 hour)
});

// Brute force protection for specific endpoints
const bruteForceProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    await rateLimiter.consume(clientIp);
    next();
  } catch (rejRes: unknown) {
    const rateLimiterRes = rejRes as RateLimiterRes;
    const msBeforeNext = rateLimiterRes.msBeforeNext || 1000;
    const remainingPoints = rateLimiterRes.remainingPoints || 0;

    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      msBeforeNext,
      remainingPoints,
    });

    res.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
    res.status(429).json({
      error: 'Too many requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: Math.round(msBeforeNext / 1000),
    });
  }
};

// Auth endpoint protection
const authProtection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const clientIp = req.ip || req.connection.remoteAddress || 'unknown';
    await authRateLimiter.consume(clientIp);
    next();
  } catch (rejRes: unknown) {
    const rateLimiterRes = rejRes as RateLimiterRes;
    const msBeforeNext = rateLimiterRes.msBeforeNext || 1000;

    logger.warn('Auth rate limit exceeded', {
      ip: req.ip,
      path: req.path,
      msBeforeNext,
    });

    res.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
    res.status(429).json({
      error: 'Too many authentication attempts',
      message: 'Account temporarily locked. Please try again later.',
      retryAfter: Math.round(msBeforeNext / 1000),
    });
  }
};

// Helmet configuration for security headers
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
      fontSrc: ["'self'", 'https://fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:'],
      scriptSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true,
  referrerPolicy: { policy: 'same-origin' },
});

// CORS configuration
const corsConfig = cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    const allowedOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      ...(process.env.ALLOWED_ORIGINS?.split(',') || []),
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      logger.warn('CORS origin blocked', { origin, allowedOrigins });
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Origin',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
    'Cache-Control',
  ],
  maxAge: 86400, // 24 hours
});

// HPP configuration to prevent HTTP Parameter Pollution
const hppConfig = hpp({
  whitelist: ['sort', 'filter', 'limit', 'offset'], // Allow these params to have multiple values
});

export {
  helmetConfig,
  corsConfig,
  hppConfig,
  bruteForceProtection,
  authProtection,
  rateLimiter,
};
