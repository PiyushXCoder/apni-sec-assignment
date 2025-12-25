interface RateLimitEntry {
  count: number;
  resetTime: number;
  firstRequest: number;
}

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

export class RateLimiter {
  private store: Map<string, RateLimitEntry>;
  private defaultConfig: RateLimitConfig;
  private endpointConfigs: Map<string, RateLimitConfig>;

  constructor(
    defaultMaxRequests: number = 100,
    defaultWindowMs: number = 15 * 60 * 1000 // 15 minutes
  ) {
    this.store = new Map();
    this.defaultConfig = {
      maxRequests: defaultMaxRequests,
      windowMs: defaultWindowMs,
    };
    this.endpointConfigs = new Map();
  }

  /**
   * Set custom rate limit for specific endpoint
   */
  setEndpointLimit(endpoint: string, maxRequests: number, windowMs: number) {
    this.endpointConfigs.set(endpoint, { maxRequests, windowMs });
  }

  /**
   * Get rate limit config for endpoint
   */
  private getConfig(endpoint?: string): RateLimitConfig {
    if (endpoint && this.endpointConfigs.has(endpoint)) {
      return this.endpointConfigs.get(endpoint)!;
    }
    return this.defaultConfig;
  }

  /**
   * Check if request is allowed and update counters
   */
  checkLimit(
    identifier: string,
    endpoint?: string
  ): {
    allowed: boolean;
    limit: number;
    remaining: number;
    reset: number;
  } {
    const now = Date.now();
    const config = this.getConfig(endpoint);
    const key = endpoint ? `${identifier}:${endpoint}` : identifier;

    // Clean up expired entries periodically
    this.cleanup(now);

    let entry = this.store.get(key);

    // No entry or window expired
    if (!entry || now >= entry.resetTime) {
      entry = {
        count: 1,
        resetTime: now + config.windowMs,
        firstRequest: now,
      };
      this.store.set(key, entry);

      return {
        allowed: true,
        limit: config.maxRequests,
        remaining: config.maxRequests - 1,
        reset: entry.resetTime,
      };
    }

    // Within the window
    entry.count++;

    const allowed = entry.count <= config.maxRequests;
    const remaining = Math.max(0, config.maxRequests - entry.count);

    return {
      allowed,
      limit: config.maxRequests,
      remaining,
      reset: entry.resetTime,
    };
  }

  /**
   * Reset rate limit for identifier
   */
  reset(identifier: string, endpoint?: string) {
    const key = endpoint ? `${identifier}:${endpoint}` : identifier;
    this.store.delete(key);
  }

  /**
   * Clean up expired entries
   */
  private cleanup(now: number) {
    // Run cleanup every 1000 requests to avoid performance impact
    if (this.store.size % 1000 === 0) {
      for (const [key, entry] of this.store.entries()) {
        if (now >= entry.resetTime) {
          this.store.delete(key);
        }
      }
    }
  }

  /**
   * Get current stats for identifier
   */
  getStats(identifier: string, endpoint?: string): RateLimitEntry | null {
    const key = endpoint ? `${identifier}:${endpoint}` : identifier;
    return this.store.get(key) || null;
  }

  /**
   * Clear all rate limit data
   */
  clearAll() {
    this.store.clear();
  }

  /**
   * Get total number of tracked identifiers
   */
  getSize(): number {
    return this.store.size;
  }
}

// Export singleton instance
export const globalRateLimiter = new RateLimiter();

// Configure endpoint-specific limits (optional)
// Example: More restrictive limits for sensitive endpoints
globalRateLimiter.setEndpointLimit("/api/auth/login", 10, 15 * 60 * 1000); // 10 per 15 min
globalRateLimiter.setEndpointLimit("/api/auth/register", 5, 15 * 60 * 1000); // 5 per 15 min
