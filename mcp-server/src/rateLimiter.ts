/**
 * Simple rate limiter for API requests
 * Implements token bucket algorithm
 */

export interface RateLimiterOptions {
  tokensPerInterval: number;
  interval: number; // in milliseconds
  maxTokens?: number;
}

export class RateLimiter {
  private tokens: number;
  private maxTokens: number;
  private tokensPerInterval: number;
  private interval: number;
  private lastRefill: number;

  constructor(options: RateLimiterOptions) {
    this.tokensPerInterval = options.tokensPerInterval;
    this.interval = options.interval;
    this.maxTokens = options.maxTokens ?? options.tokensPerInterval;
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refill(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = Math.floor((elapsed / this.interval) * this.tokensPerInterval);

    if (tokensToAdd > 0) {
      this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd);
      this.lastRefill = now;
    }
  }

  /**
   * Try to consume a token
   * @returns true if token was consumed, false if rate limit exceeded
   */
  tryConsume(tokens: number = 1): boolean {
    this.refill();

    if (this.tokens >= tokens) {
      this.tokens -= tokens;
      return true;
    }

    return false;
  }

  /**
   * Wait until tokens are available, then consume
   */
  async consume(tokens: number = 1): Promise<void> {
    while (!this.tryConsume(tokens)) {
      // Calculate wait time
      const tokensNeeded = tokens - this.tokens;
      const intervalsNeeded = Math.ceil(tokensNeeded / this.tokensPerInterval);
      const waitTime = intervalsNeeded * this.interval;

      await new Promise(resolve => setTimeout(resolve, Math.min(waitTime, 1000)));
    }
  }

  /**
   * Get remaining tokens
   */
  getRemainingTokens(): number {
    this.refill();
    return this.tokens;
  }

  /**
   * Reset the rate limiter
   */
  reset(): void {
    this.tokens = this.maxTokens;
    this.lastRefill = Date.now();
  }
}

/**
 * Simple cache for API responses
 */
export interface CacheOptions {
  ttl: number; // Time to live in milliseconds
  maxSize?: number; // Maximum number of entries
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

export class ResponseCache<T = unknown> {
  private cache: Map<string, CacheEntry<T>>;
  private ttl: number;
  private maxSize: number;

  constructor(options: CacheOptions) {
    this.cache = new Map();
    this.ttl = options.ttl;
    this.maxSize = options.maxSize ?? 100;
  }

  /**
   * Get cached value if it exists and hasn't expired
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      // Entry expired
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Set a value in the cache
   */
  set(key: string, data: T): void {
    // Implement simple LRU: remove oldest entry if at max size
    if (this.cache.size >= this.maxSize && !this.cache.has(key)) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey !== undefined) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear the cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Remove expired entries
   */
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

