# Security Best Practices for Sanity API Operations

This folder contains security considerations, best practices, and guidelines for secure Sanity API operations.

## 📁 Security Categories

### Authentication & Authorization

- `token-management.md` - Managing API tokens securely
- `permission-management.md` - Setting up proper permissions
- `role-based-access.md` - Implementing RBAC
- `multi-factor-auth.md` - Adding MFA to operations

### Data Protection

- `data-encryption.md` - Encrypting sensitive data
- `pii-handling.md` - Handling personally identifiable information
- `data-masking.md` - Masking sensitive data in logs
- `secure-transmission.md` - Secure data transmission

### API Security

- `rate-limiting.md` - Implementing rate limiting
- `input-validation.md` - Validating API inputs
- `sql-injection-prevention.md` - Preventing injection attacks
- `cors-configuration.md` - Configuring CORS properly

### Environment Security

- `environment-variables.md` - Managing environment variables
- `secrets-management.md` - Managing secrets securely
- `network-security.md` - Network-level security
- `monitoring-security.md` - Security monitoring

## 🔐 Security Fundamentals

### API Token Security

```typescript
// security/token-manager.ts
export class TokenManager {
  private static instance: TokenManager;
  private tokens: Map<string, string> = new Map();

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  setToken(name: string, token: string): void {
    // Validate token format
    if (!this.isValidToken(token)) {
      throw new Error('Invalid token format');
    }

    // Encrypt token before storing
    const encryptedToken = this.encrypt(token);
    this.tokens.set(name, encryptedToken);
  }

  getToken(name: string): string {
    const encryptedToken = this.tokens.get(name);
    if (!encryptedToken) {
      throw new Error('Token not found');
    }

    return this.decrypt(encryptedToken);
  }

  private isValidToken(token: string): boolean {
    // Implement token validation logic
    return token.length >= 32 && /^[a-zA-Z0-9_-]+$/.test(token);
  }

  private encrypt(text: string): string {
    // Implement encryption (use a proper encryption library)
    return Buffer.from(text).toString('base64');
  }

  private decrypt(encryptedText: string): string {
    // Implement decryption
    return Buffer.from(encryptedText, 'base64').toString();
  }
}
```

### Input Validation

```typescript
// security/validator.ts
export class SecurityValidator {
  static validateDocument(doc: any): boolean {
    // Check for malicious content
    if (this.containsScriptTags(doc)) {
      throw new Error('Document contains script tags');
    }

    // Validate required fields
    if (!this.hasRequiredFields(doc)) {
      throw new Error('Missing required fields');
    }

    // Check field lengths
    if (!this.validateFieldLengths(doc)) {
      throw new Error('Field length exceeds limits');
    }

    return true;
  }

  static validateQuery(query: string): boolean {
    // Prevent GROQ injection
    if (this.containsDangerousPatterns(query)) {
      throw new Error('Query contains dangerous patterns');
    }

    return true;
  }

  private static containsScriptTags(doc: any): boolean {
    const docString = JSON.stringify(doc);
    return /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi.test(docString);
  }

  private static hasRequiredFields(doc: any): boolean {
    const required = ['_type', 'title'];
    return required.every((field) => doc.hasOwnProperty(field));
  }

  private static validateFieldLengths(doc: any): boolean {
    const maxLengths = {
      title: 200,
      content: 10000,
      description: 500,
    };

    return Object.entries(maxLengths).every(([field, maxLength]) => {
      return !doc[field] || doc[field].length <= maxLength;
    });
  }

  private static containsDangerousPatterns(query: string): boolean {
    const dangerousPatterns = [
      /eval\s*\(/i,
      /exec\s*\(/i,
      /system\s*\(/i,
      /delete\s+from/i,
      /drop\s+table/i,
    ];

    return dangerousPatterns.some((pattern) => pattern.test(query));
  }
}
```

## 🛡️ Security Monitoring

### Security Logger

```typescript
// security/logger.ts
export class SecurityLogger {
  private static instance: SecurityLogger;
  private securityEvents: any[] = [];

  static getInstance(): SecurityLogger {
    if (!SecurityLogger.instance) {
      SecurityLogger.instance = new SecurityLogger();
    }
    return SecurityLogger.instance;
  }

  logSecurityEvent(event: SecurityEvent): void {
    // Mask sensitive data
    const maskedEvent = this.maskSensitiveData(event);

    // Add timestamp
    maskedEvent.timestamp = new Date().toISOString();

    // Store event
    this.securityEvents.push(maskedEvent);

    // Alert if high severity
    if (event.severity === 'high') {
      this.alertSecurityTeam(maskedEvent);
    }
  }

  private maskSensitiveData(event: SecurityEvent): any {
    const masked = { ...event };

    // Mask tokens, passwords, etc.
    if (masked.data?.token) {
      masked.data.token = '***MASKED***';
    }

    if (masked.data?.password) {
      masked.data.password = '***MASKED***';
    }

    return masked;
  }

  private alertSecurityTeam(event: any): void {
    // Send alert via email, Slack, etc.
    console.warn('SECURITY ALERT:', event);
  }
}

interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'data_access' | 'input_validation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  data?: any;
  userId?: string;
  ipAddress?: string;
}
```

### Rate Limiting

```typescript
// security/rate-limiter.ts
export class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private limits = {
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 100, // max 100 requests per window
  };

  isAllowed(identifier: string): boolean {
    const now = Date.now();
    const windowStart = now - this.limits.windowMs;

    // Get existing requests for this identifier
    const requests = this.requests.get(identifier) || [];

    // Filter requests within current window
    const recentRequests = requests.filter((time) => time > windowStart);

    // Check if under limit
    if (recentRequests.length >= this.limits.maxRequests) {
      return false;
    }

    // Add current request
    recentRequests.push(now);
    this.requests.set(identifier, recentRequests);

    return true;
  }

  getRemainingRequests(identifier: string): number {
    const now = Date.now();
    const windowStart = now - this.limits.windowMs;
    const requests = this.requests.get(identifier) || [];
    const recentRequests = requests.filter((time) => time > windowStart);

    return Math.max(0, this.limits.maxRequests - recentRequests.length);
  }
}
```

## 🔒 Security Best Practices

### Environment Variables

```typescript
// security/env-manager.ts
export class EnvironmentManager {
  static validateEnvironment(): void {
    const required = ['SANITY_PROJECT_ID', 'SANITY_DATASET', 'SANITY_TOKEN'];

    const missing = required.filter((key) => !process.env[key]);

    if (missing.length > 0) {
      throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
    }

    // Validate token format
    const token = process.env.SANITY_TOKEN!;
    if (!this.isValidToken(token)) {
      throw new Error('Invalid SANITY_TOKEN format');
    }
  }

  private static isValidToken(token: string): boolean {
    return token.length >= 32 && /^sk[a-zA-Z0-9_-]+$/.test(token);
  }
}
```

### Secure Client Configuration

```typescript
// security/secure-client.ts
import { createClient } from '@sanity/client';

export const createSecureClient = () => {
  // Validate environment
  EnvironmentManager.validateEnvironment();

  // Create client with security settings
  return createClient({
    projectId: process.env.SANITY_PROJECT_ID!,
    dataset: process.env.SANITY_DATASET!,
    token: process.env.SANITY_TOKEN!,
    apiVersion: '2023-05-03',
    useCdn: false, // Disable CDN for sensitive operations
    perspective: 'published', // Only access published content
  });
};
```

## 📊 Security Metrics

### Key Security Indicators

- **Failed Authentication Attempts**: Count of failed logins
- **Unauthorized Access Attempts**: Count of access violations
- **Rate Limit Violations**: Count of rate limit exceeded
- **Input Validation Failures**: Count of invalid inputs
- **Security Alerts**: Count of security events

### Security Dashboard

```typescript
interface SecurityMetrics {
  totalSecurityEvents: number;
  failedAuthentications: number;
  unauthorizedAccess: number;
  rateLimitViolations: number;
  inputValidationFailures: number;
  securityAlerts: number;
  lastUpdated: string;
}
```

## 🚨 Security Incident Response

### Incident Classification

- **Low**: Minor security events, no immediate threat
- **Medium**: Potential security issues, requires investigation
- **High**: Active security threats, immediate response needed
- **Critical**: Severe security breaches, emergency response

### Response Procedures

1. **Detection**: Identify security incident
2. **Assessment**: Evaluate severity and impact
3. **Containment**: Limit damage and prevent spread
4. **Investigation**: Determine root cause
5. **Remediation**: Fix security issues
6. **Recovery**: Restore normal operations
7. **Documentation**: Record incident and lessons learned

## 🔍 Security Auditing

### Audit Trail

```typescript
interface AuditLog {
  timestamp: string;
  userId: string;
  action: string;
  resource: string;
  result: 'success' | 'failure';
  ipAddress: string;
  userAgent: string;
  details?: any;
}
```

### Compliance Requirements

- **GDPR**: Data protection and privacy
- **SOC 2**: Security controls and procedures
- **ISO 27001**: Information security management
- **HIPAA**: Healthcare data protection

---

**Last Updated**: [Current Date]
**Security Score**: TBD
**Incidents Reported**: 0
