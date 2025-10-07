import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const dbConfig = configService.get('database');
                if (!dbConfig) {
                    throw new Error('Database configuration not found');
                }
                return dbConfig;
            },
        }),
    ],
})

export class DatabaseModule { };