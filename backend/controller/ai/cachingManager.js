/**
 * Caching Manager for Recommendation System
 * Improves performance by storing frequently accessed data
 */

class CachingManager {
  constructor() {
    this.cache = new Map();
    this.timestamps = new Map();
    this.hitRate = { hits: 0, misses: 0 };
  }

  /**
   * Set cache with TTL (time to live in milliseconds)
   */
  set(key, value, ttlMs = 3600000) { // Default 1 hour
    this.cache.set(key, value);
    this.timestamps.set(key, Date.now() + ttlMs);
  }

  /**
   * Get cache value
   */
  get(key) {
    // Check if expired
    if (this.timestamps.has(key)) {
      if (Date.now() > this.timestamps.get(key)) {
        this.cache.delete(key);
        this.timestamps.delete(key);
        this.hitRate.misses++;
        return null;
      }
    }

    if (this.cache.has(key)) {
      this.hitRate.hits++;
      return this.cache.get(key);
    }

    this.hitRate.misses++;
    return null;
  }

  /**
   * Check if key exists and is valid
   */
  has(key) {
    if (!this.cache.has(key)) return false;
    if (this.timestamps.has(key) && Date.now() > this.timestamps.get(key)) {
      this.cache.delete(key);
      this.timestamps.delete(key);
      return false;
    }
    return true;
  }

  /**
   * Delete specific key
   */
  delete(key) {
    this.cache.delete(key);
    this.timestamps.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
    this.timestamps.clear();
  }

  /**
   * Get cache statistics
   */
  getStats() {
    const total = this.hitRate.hits + this.hitRate.misses;
    return {
      hits: this.hitRate.hits,
      misses: this.hitRate.misses,
      hitRate: total > 0 ? ((this.hitRate.hits / total) * 100).toFixed(2) + "%" : "N/A",
      size: this.cache.size,
    };
  }

  /**
   * Reset statistics
   */
  resetStats() {
    this.hitRate = { hits: 0, misses: 0 };
  }

  /**
   * Get cache entry with metadata
   */
  getWithMetadata(key) {
    if (!this.has(key)) return null;

    return {
      value: this.cache.get(key),
      expiresAt: this.timestamps.get(key),
      age: Date.now() - (this.timestamps.get(key) - 3600000),
    };
  }

  /**
   * Generate cache key from parameters
   */
  static generateKey(...params) {
    return params.map(p => {
      if (typeof p === "object") return JSON.stringify(p);
      return String(p);
    }).join("::");
  }
}

// User preference cache with different TTL
class UserPreferenceCache {
  constructor() {
    this.preferences = new Map();
    this.lastUpdated = new Map();
  }

  set(userId, preferences, ttlMs = 86400000) { // Default 24 hours
    this.preferences.set(userId, preferences);
    this.lastUpdated.set(userId, Date.now() + ttlMs);
  }

  get(userId) {
    if (this.lastUpdated.has(userId) && Date.now() > this.lastUpdated.get(userId)) {
      this.preferences.delete(userId);
      this.lastUpdated.delete(userId);
      return null;
    }
    return this.preferences.get(userId) || null;
  }

  invalidate(userId) {
    this.preferences.delete(userId);
    this.lastUpdated.delete(userId);
  }

  has(userId) {
    const expired = this.lastUpdated.has(userId) && Date.now() > this.lastUpdated.get(userId);
    if (expired) {
      this.preferences.delete(userId);
      this.lastUpdated.delete(userId);
      return false;
    }
    return this.preferences.has(userId);
  }
}

// Trending data cache with short TTL
class TrendingCache {
  constructor() {
    this.trending = new Map();
    this.lastFetched = 0;
  }

  setTrending(data, ttlMs = 600000) { // Default 10 minutes
    this.trending.set("current", data);
    this.lastFetched = Date.now() + ttlMs;
  }

  getTrending() {
    if (Date.now() > this.lastFetched) {
      this.trending.clear();
      return null;
    }
    return this.trending.get("current") || null;
  }

  isFresh() {
    return Date.now() < this.lastFetched;
  }

  getAge() {
    return Date.now() - (this.lastFetched - 600000);
  }
}

// Export singleton instances
export const generalCache = new CachingManager();
export const userPreferenceCache = new UserPreferenceCache();
export const trendingCache = new TrendingCache();

export { CachingManager, UserPreferenceCache, TrendingCache };
