import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './cache.service';
import { CACHE_OPTIONS_METADATA, CacheOptions, generateCacheKey } from './cache.decorator';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
    constructor(
        private readonly cacheService: CacheService,
        private readonly reflector: Reflector,
    ) { }

    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const cacheOptions = this.reflector.get<CacheOptions>(
            CACHE_OPTIONS_METADATA,
            context.getHandler(),
        );

        if (!cacheOptions) {
            return next.handle();
        }

        const className = context.getClass().name;
        const methodName = context.getHandler().name;
        const args = context.getArgs();

        // Extract method arguments (skip request, response objects)
        const methodArgs = this.extractMethodArguments(args);

        const cacheKey = generateCacheKey(
            className,
            methodName,
            methodArgs,
            cacheOptions.key,
        );

        // Try to get from cache
        const cachedValue = await this.cacheService.get(cacheKey);
        if (cachedValue !== undefined) {
            return of(cachedValue);
        }

        // Execute method and cache result
        return next.handle().pipe(
            tap(async (result) => {
                if (result !== undefined) {
                    await this.cacheService.set(cacheKey, result, cacheOptions.ttl);
                }
            }),
        );
    }

    private extractMethodArguments(args: any[]): any[] {
        // Skip HTTP request/response objects and extract actual method parameters
        return args.filter((arg) => {
            return arg !== null &&
                arg !== undefined &&
                typeof arg !== 'object' ||
                (!arg.req && !arg.res && !arg.request && !arg.response);
        });
    }
}