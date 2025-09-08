import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import {
  helmetConfig,
  corsConfig,
  hppConfig,
  bruteForceProtection,
} from '../middleware/security';

describe('Security Middleware Tests', () => {
  let app: express.Application;

  beforeAll(() => {
    app = express();

    // Apply security middleware
    app.use(helmetConfig);
    app.use(corsConfig);
    app.use(hppConfig);
    app.use(bruteForceProtection);
    app.use(express.json({ limit: '1mb' }));

    // Test routes
    app.get('/test', (req, res) => {
      res.json({ message: 'OK' });
    });

    app.post('/test', (req, res) => {
      res.json({ body: req.body });
    });
  });

  describe('Security Headers (Helmet)', () => {
    it('should set security headers', async () => {
      const response = await request(app).get('/test').expect(200);

      expect(response.headers['x-content-type-options']).toBe('nosniff');
      expect(response.headers['x-frame-options']).toBe('DENY');
      expect(response.headers['x-xss-protection']).toBe('0');
      expect(response.headers['strict-transport-security']).toContain(
        'max-age=31536000'
      );
    });

    it('should set Content Security Policy', async () => {
      const response = await request(app).get('/test').expect(200);

      expect(response.headers['content-security-policy']).toContain(
        "default-src 'self'"
      );
    });
  });

  describe('CORS Protection', () => {
    it('should allow configured origins', async () => {
      const response = await request(app)
        .get('/test')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBe(
        'http://localhost:3000'
      );
      expect(response.headers['access-control-allow-credentials']).toBe('true');
    });

    it('should block unconfigured origins', async () => {
      await request(app)
        .get('/test')
        .set('Origin', 'https://malicious-site.com')
        .expect(500); // CORS error
    });
  });

  describe('HTTP Parameter Pollution Protection', () => {
    it('should allow whitelisted parameters with multiple values', async () => {
      const response = await request(app)
        .get('/test?sort=name&sort=date&filter=active')
        .expect(200);

      expect(response.status).toBe(200);
    });

    it('should handle single parameter values normally', async () => {
      const response = await request(app)
        .get('/test?id=123&name=test')
        .expect(200);

      expect(response.status).toBe(200);
    });
  });

  describe('Request Size Limits', () => {
    it('should accept requests within size limit', async () => {
      const smallData = { message: 'This is a small message' };

      const response = await request(app)
        .post('/test')
        .send(smallData)
        .expect(200);

      expect(response.body.body).toEqual(smallData);
    });

    it('should reject requests exceeding size limit', async () => {
      // Create a large payload (over 1MB)
      const largeData = {
        data: 'x'.repeat(2 * 1024 * 1024), // 2MB of data
      };

      await request(app).post('/test').send(largeData).expect(413); // Payload Too Large
    });
  });

  describe('Rate Limiting', () => {
    it('should allow requests within rate limit', async () => {
      const response = await request(app).get('/test').expect(200);

      expect(response.body.message).toBe('OK');
    });

    // Note: Rate limiting tests would require more complex setup
    // to simulate multiple IPs or wait for time windows
  });

  describe('Security Headers Validation', () => {
    it('should include all required security headers', async () => {
      const response = await request(app).get('/test').expect(200);

      const securityHeaders = [
        'x-content-type-options',
        'x-frame-options',
        'strict-transport-security',
        'content-security-policy',
      ];

      securityHeaders.forEach((header) => {
        expect(response.headers[header]).toBeDefined();
      });
    });

    it('should not expose server information', async () => {
      const response = await request(app).get('/test').expect(200);

      expect(response.headers['x-powered-by']).toBeUndefined();
      expect(response.headers['server']).toBeUndefined();
    });
  });
});
