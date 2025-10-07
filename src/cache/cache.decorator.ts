import { SetMetadata } from '@nestjs/common';

export const CACHE_OPTIONS_METADATA = 'cache_options';

export interface CacheOptions {
    /**
     * Cache key pattern. Use {0}, {1}, etc. for parameter substitution
     * Example: 'user:{0}' for user:123
     */
    key?: string;
    /**
     * Time to live in seconds
     */
    ttl?: number;
    /**
     * Whether to use method parameters as cache key parts
     */
    useParams?: boolean;
}

/**
 * Decorator to enable caching on methods
 */
export function Cacheable(options: CacheOptions = {}) {
    return SetMetadata(CACHE_OPTIONS_METADATA, options);
}

/**
 * Generate cache key from method name and parameters
 */
export function generateCacheKey(
    className: string,
    methodName: string,
    args: any[],
    pattern?: string,
): string {
    if (pattern) {
        let key = pattern;
        args.forEach((arg, index) => {
            key = key.replace(new RegExp(`\\{${index}\\}`, 'g'), String(arg));
        });
        return key;
    }

    const params = args.length > 0 ? ':' + args.map(arg => String(arg)).join(':') : '';
    return `${className.toLowerCase()}:${methodName}${params}`;
}