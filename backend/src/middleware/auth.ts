import { Request, Response, NextFunction } from 'express';
import { authProtection } from './security';
import { logger } from '../utils/logger';

export const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  // Apply auth-specific rate limiting first
  try {
    await new Promise<void>((resolve, reject) => {
      authProtection(req, res, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  } catch {
    // Rate limiting already handled the response
    return;
  }

  const authHeader = req.headers.authorization;
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.substring(7)
      : null;

  if (!token || token !== process.env.API_TOKEN) {
    logger.warn('Authentication failed', {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      path: req.path,
      hasToken: !!token,
    });

    res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid or missing authentication token',
    });
    return;
  }

  logger.info('Authentication successful', {
    ip: req.ip,
    path: req.path,
  });

  next();
};
