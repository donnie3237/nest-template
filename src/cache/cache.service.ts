import { Injectable, Inject, Logger } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
    private readonly logger = new Logger(CacheService.name);

    constructor(@Inject(CACHE_MANAGER) private cacheManager: any) { }

    /**
     * Get a value from cache
     */
    async get<T>(key: string): Promise<T | undefined> {
        try {
            const value = await this.cacheManager.get(key);
            if (value) {
                this.logger.debug(`Cache hit for key: ${key}`);
            } else {
                this.logger.debug(`Cache miss for key: ${key}`);
            }
            return value as T;
        } catch (error) {
            this.logger.error(`Error getting cache key ${key}:`, error);
            return undefined;
        }
    }

    /**
     * Set a value in cache with optional TTL
     */
    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
        try {
            await this.cacheManager.set(key, value, ttl);
            this.logger.debug(`Cache set for key: ${key}`);
        } catch (error) {
            this.logger.error(`Error setting cache key ${key}:`, error);
        }
    }

    /**
     * Delete a value from cache
     */
    async del(key: string): Promise<void> {
        try {
            await this.cacheManager.del(key);
            this.logger.debug(`Cache deleted for key: ${key}`);
        } catch (error) {
            this.logger.error(`Error deleting cache key ${key}:`, error);
        }
    }

    /**
     * Clear all cache
     */
    async reset(): Promise<void> {
        try {
            // For simple in-memory cache, we'll clear by deleting individual keys
            // or use reset if available
            if (typeof this.cacheManager.reset === 'function') {
                await this.cacheManager.reset();
            } else {
                // Fallback - this is a simple implementation
                this.logger.warn('Cache reset not directly supported, individual key deletion required');
            }
            this.logger.debug('Cache cleared');
        } catch (error) {
            this.logger.error('Error clearing cache:', error);
        }
    }

    /**
     * Get multiple values from cache
     */
    async mget<T>(...keys: string[]): Promise<(T | undefined)[]> {
        try {
            const promises = keys.map(key => this.get<T>(key));
            return await Promise.all(promises);
        } catch (error) {
            this.logger.error(`Error getting multiple cache keys:`, error);
            return keys.map(() => undefined);
        }
    }

    /**
     * Set multiple values in cache
     */
    async mset<T>(keyValuePairs: Array<{ key: string; value: T; ttl?: number }>): Promise<void> {
        try {
            const promises = keyValuePairs.map(({ key, value, ttl }) => this.set(key, value, ttl));
            await Promise.all(promises);
        } catch (error) {
            this.logger.error('Error setting multiple cache keys:', error);
        }
    }

    /**
     * Check if key exists in cache
     */
    async has(key: string): Promise<boolean> {
        try {
            const value = await this.cacheManager.get(key);
            return value !== undefined;
        } catch (error) {
            this.logger.error(`Error checking cache key ${key}:`, error);
            return false;
        }
    }

    /**
     * Get or set cache value with a function
     */
    async getOrSet<T>(
        key: string,
        factory: () => Promise<T> | T,
        ttl?: number,
    ): Promise<T> {
        try {
            let value = await this.get<T>(key);

            if (value === undefined) {
                value = await factory();
                if (value !== undefined) {
                    await this.set(key, value, ttl);
                }
            }

            return value as T;
        } catch (error) {
            this.logger.error(`Error in getOrSet for key ${key}:`, error);
            throw error;
        }
    }
}