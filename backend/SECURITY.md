# Security Implementation Guide

This document outlines the comprehensive security measures implemented in the Fire Incident API backend.

## 🛡️ HTTP Boundary & Abuse Protection

### 1. Security Headers (Helmet)

**Implemented protections:**

- **Content Security Policy (CSP)**: Prevents XSS attacks by controlling resource loading
- **HTTP Strict Transport Security (HSTS)**: Forces HTTPS connections for 1 year
- **X-Frame-Options**: Prevents clickjacking by denying iframe embedding
- **X-Content-Type-Options**: Prevents MIME-type confusion attacks
- **X-XSS-Protection**: Enables browser XSS filtering
- **Referrer Policy**: Controls referrer information sent with requests

### 2. Rate Limiting & Brute Force Protection

**General API Rate Limiting:**

- 100 requests per 15 minutes per IP address
- 15-minute blocking period when limit exceeded
- Memory-based storage (configurable for Redis in production)

**Authentication Endpoint Protection:**

- 5 authentication attempts per 15 minutes per IP
- 1-hour blocking period for failed auth attempts
- Separate rate limiter for auth endpoints

### 3. HTTP Parameter Pollution Protection (HPP)

**Protection against:**

- Parameter pollution attacks
- Whitelisted parameters: `sort`, `filter`, `limit`, `offset`
- All other duplicate parameters are blocked

### 4. CORS Configuration

**Strict origin control:**

- Allowlisted origins only (no wildcard `*` on credentials)
- Credentials support enabled
- Specific HTTP methods allowed: GET, POST, PUT, DELETE, PATCH, OPTIONS
- Controlled headers whitelist
- 24-hour preflight cache

**Default allowed origins:**

- `http://localhost:3000`
- `http://127.0.0.1:3000`
- Additional origins via `ALLOWED_ORIGINS` environment variable

### 5. Request Size Limits

**Body size protection:**

- JSON body limit: 1MB (configurable)
- URL-encoded body limit: 1MB (configurable)
- Form field limits: 10 fields max, 100 chars field names, 1MB field values

## 📁 File Upload Security

### 1. File Type Validation

**Dual validation:**

- File extension checking
- MIME type verification
- Extension-MIME type matching validation

**Allowed file types:**

- **Images only**: .jpg, .jpeg, .png, .gif

### 2. File Size & Quantity Limits

- **Single file limit**: 10MB (configurable)
- **Files per request**: 5 maximum (configurable)
- **Total request size**: Controlled by Express body parser

### 3. Secure File Naming

- Cryptographically secure random filenames
- Original filename sanitization
- Special character removal/replacement

### 4. Upload Error Handling

- Comprehensive error categorization
- Detailed logging of upload attempts
- User-friendly error messages
- Security event logging

## 🔐 Authentication Security

### 1. Enhanced Auth Middleware

**Features:**

- Rate limiting integration
- Comprehensive request logging
- IP address tracking
- User agent logging
- Failed attempt monitoring

### 2. Security Logging

**Logged events:**

- Authentication attempts (success/failure)
- Rate limit violations
- File upload attempts
- CORS violations
- Security header violations

## ⚙️ Configuration

### Environment Variables

```bash
# Security Configuration
API_TOKEN=your-secure-api-token-here
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000          # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100          # Requests per window
AUTH_RATE_LIMIT_MAX_REQUESTS=5       # Auth attempts per window
AUTH_RATE_LIMIT_WINDOW_MS=900000     # Auth window (15 minutes)

# Request Size Limits
MAX_REQUEST_SIZE=1mb                 # Express body parser limit
MAX_FILE_SIZE=10485760              # File upload limit (10MB)

# Upload Security
ALLOWED_FILE_TYPES=.jpg,.jpeg,.png,.gif
MAX_FILES_PER_REQUEST=5             # Files per upload request

# Redis (Production)
REDIS_URL=redis://localhost:6379    # For distributed rate limiting
REDIS_PASSWORD=your-redis-password

# Logging
LOG_LEVEL=info
LOG_FILE=logs/app.log
```

## 🚀 Production Recommendations

### 1. Redis Integration

For production environments, implement Redis-based rate limiting:

```typescript
// In security.ts
const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rl_',
  points: 100,
  duration: 900,
  blockDuration: 900,
});
```

### 2. HTTPS/TLS

- Use proper SSL certificates
- Configure HSTS with preload
- Implement certificate pinning if needed

### 3. Monitoring & Alerting

- Monitor rate limit violations
- Alert on authentication failures
- Track file upload patterns
- Log security events to centralized logging

### 4. Additional Security Layers

Consider implementing:

- Web Application Firewall (WAF)
- DDoS protection (Cloudflare, AWS Shield)
- IP geolocation blocking
- Bot detection and mitigation
- Automated threat response

## 🔍 Security Testing

### Test Rate Limiting

```bash
# Test general rate limiting
for i in {1..110}; do curl http://localhost:3001/health; done

# Test auth rate limiting
for i in {1..10}; do curl -H "Authorization: Bearer invalid" http://localhost:3001/api/incidents; done
```

### Test File Upload Security

```bash
# Test file size limit
curl -X POST -F "evidence=@large_file.jpg" http://localhost:3001/api/incidents

# Test file type restriction
curl -X POST -F "evidence=@malicious.exe" http://localhost:3001/api/incidents
```

### Test CORS

```bash
# Test blocked origin
curl -H "Origin: https://malicious-site.com" http://localhost:3001/api/incidents
```

## 📋 Security Checklist

- [x] Security headers implemented (Helmet)
- [x] Rate limiting configured
- [x] Brute force protection active
- [x] HTTP parameter pollution blocked
- [x] CORS properly configured
- [x] Request size limits enforced
- [x] File upload security implemented
- [x] Authentication hardened
- [x] Comprehensive logging enabled
- [x] Error handling secured
- [x] Environment variables documented
- [x] Security testing procedures documented

## 🆘 Incident Response

In case of security incidents:

1. **Monitor logs** for unusual patterns
2. **Block malicious IPs** via rate limiter or firewall
3. **Review authentication logs** for compromise indicators
4. **Check file uploads** for malicious content
5. **Update security configurations** as needed
6. **Document incidents** for future prevention

---

**Security Contact**: System Administrator
**Last Updated**: September 2025
**Review Schedule**: Monthly security review recommended
