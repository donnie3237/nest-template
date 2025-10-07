import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { CacheService } from './cache.service';
import { CacheInterceptor } from './cache.interceptor';

@Global()
@Module({
    imports: [
        NestCacheModule.register({
            ttl: 60 * 60 * 1000,
            max: 100,
            isGlobal: true,
        }),
    ],
    providers: [CacheService, CacheInterceptor],
    exports: [CacheService, CacheInterceptor, NestCacheModule],
})
export class CacheModule { }