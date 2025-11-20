import { RateLimiter, ResponseCache } from '../rateLimiter.js';

describe('RateLimiter', () => {
  jest.useFakeTimers();

  afterEach(() => {
    jest.clearAllTimers();
  });

  it('should allow consumption within rate limit', () => {
    const limiter = new RateLimiter({
      tokensPerInterval: 10,
      interval: 1000,
    });

    expect(limiter.tryConsume(5)).toBe(true);
    expect(limiter.tryConsume(5)).toBe(true);
    expect(limiter.tryConsume(1)).toBe(false); // Exceeded limit
  });

  it('should refill tokens over time', () => {
    const limiter = new RateLimiter({
      tokensPerInterval: 10,
      interval: 1000,
    });

    limiter.tryConsume(10); // Consume all tokens
    expect(limiter.tryConsume(1)).toBe(false);

    jest.advanceTimersByTime(1000); // Wait for refill
    expect(limiter.tryConsume(5)).toBe(true);
  });

  it('should not exceed max tokens', () => {
    const limiter = new RateLimiter({
      tokensPerInterval: 10,
      interval: 1000,
      maxTokens: 15,
    });

    jest.advanceTimersByTime(5000); // Wait a long time
    expect(limiter.getRemainingTokens()).toBeLessThanOrEqual(15);
  });

  it('should reset properly', () => {
    const limiter = new RateLimiter({
      tokensPerInterval: 10,
      interval: 1000,
    });

    limiter.tryConsume(10);
    expect(limiter.getRemainingTokens()).toBe(0);

    limiter.reset();
    expect(limiter.getRemainingTokens()).toBe(10);
  });
});

describe('ResponseCache', () => {
  it('should cache and retrieve values', () => {
    const cache = new ResponseCache({ ttl: 5000 });

    cache.set('key1', { data: 'value1' });
    expect(cache.get('key1')).toEqual({ data: 'value1' });
  });

  it('should return null for non-existent keys', () => {
    const cache = new ResponseCache({ ttl: 5000 });
    expect(cache.get('nonexistent')).toBeNull();
  });

  it('should expire old entries', () => {
    jest.useFakeTimers();
    const cache = new ResponseCache({ ttl: 1000 });

    cache.set('key1', { data: 'value1' });
    jest.advanceTimersByTime(1001);
    
    expect(cache.get('key1')).toBeNull();
    jest.useRealTimers();
  });

  it('should enforce max size with LRU', () => {
    const cache = new ResponseCache({ ttl: 5000, maxSize: 2 });

    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    cache.set('key3', 'value3'); // Should evict key1

    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe('value2');
    expect(cache.get('key3')).toBe('value3');
  });

  it('should clear all entries', () => {
    const cache = new ResponseCache({ ttl: 5000 });

    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    cache.clear();
    
    expect(cache.size()).toBe(0);
    expect(cache.get('key1')).toBeNull();
  });

  it('should cleanup expired entries', () => {
    jest.useFakeTimers();
    const cache = new ResponseCache({ ttl: 1000 });

    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    jest.advanceTimersByTime(1001);
    cache.cleanup();
    
    expect(cache.size()).toBe(0);
    jest.useRealTimers();
  });
});

