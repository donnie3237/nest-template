import { Controller, Get } from '@nestjs/common';
import {
    HealthCheckService,
    HealthCheck,
    TypeOrmHealthIndicator,
    MemoryHealthIndicator,
    DiskHealthIndicator,
} from '@nestjs/terminus';

@Controller('health')
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private db: TypeOrmHealthIndicator,
        private memory: MemoryHealthIndicator,
        private disk: DiskHealthIndicator,
    ) { }

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            // Database health check
            () => this.db.pingCheck('database'),

            // Memory health check (heap should not use more than 300MB)
            () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),

            // Memory health check (RSS should not use more than 300MB)
            () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),

            // Disk health check (disk should not use more than 80% of available space)
            () => this.disk.checkStorage('storage', {
                path: process.platform === 'win32' ? 'C:\\' : '/',
                thresholdPercent: 0.8
            }),
        ]);
    }

    @Get('database')
    @HealthCheck()
    checkDatabase() {
        return this.health.check([
            () => this.db.pingCheck('database'),
        ]);
    }

    @Get('memory')
    @HealthCheck()
    checkMemory() {
        return this.health.check([
            () => this.memory.checkHeap('memory_heap', 300 * 1024 * 1024),
            () => this.memory.checkRSS('memory_rss', 300 * 1024 * 1024),
        ]);
    }

    @Get('disk')
    @HealthCheck()
    checkDisk() {
        return this.health.check([
            () => this.disk.checkStorage('storage', {
                path: process.platform === 'win32' ? 'C:\\' : '/',
                thresholdPercent: 0.8
            }),
        ]);
    }
}