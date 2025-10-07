// config
import { ConfigModule } from '@nestjs/config';
import databaseConfig from './config/database.config';
import redisConfig from './config/redis.config';
import rabbitmqConfig from './config/rabbitmq.config';

// common modules
import { DatabaseModule } from './database/database.module';
import { Module } from '@nestjs/common';
import { HealthModule } from './health/health.module';
import { CacheModule } from './cache/cache.module';

// app modules
import { UsersModule } from '@/modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, redisConfig, rabbitmqConfig],
    }),
    // common modules
    CacheModule,
    HealthModule,
    DatabaseModule,

    // app modules
    UsersModule,
  ],
})
export class AppModule { }
