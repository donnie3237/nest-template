import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from '../../src/app.module';
import { describe, it, expect, beforeAll, afterAll } from 'vitest';

describe('Health Check (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        status: expect.any(String),
        info: expect.any(Object),
        error: expect.any(Object),
        details: expect.any(Object)
      }));

      // Should have database health check
      expect(response.body.details).toHaveProperty('database');

      // Should have memory health check  
      expect(response.body.details).toHaveProperty('memory_heap');
      expect(response.body.details).toHaveProperty('memory_rss');

      // Should have disk health check
      expect(response.body.details).toHaveProperty('storage');
    });

    it('should have all health indicators passing', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      // Check that main status is 'ok'
      expect(response.body.status).toBe('ok');

      // Check individual health indicators
      const details = response.body.details;

      // Database should be healthy
      expect(details.database?.status).toBe('up');

      // Memory checks should be healthy
      expect(details.memory_heap?.status).toBe('up');
      expect(details.memory_rss?.status).toBe('up');

      // Storage should be healthy
      expect(details.storage?.status).toBe('up');
    });

    it('should provide memory usage information', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      const memoryHeap = response.body.details.memory_heap;
      const memoryRss = response.body.details.memory_rss;

      expect(memoryHeap).toEqual(expect.objectContaining({
        status: 'up',
        used: expect.any(Number),
        total: expect.any(Number)
      }));

      expect(memoryRss).toEqual(expect.objectContaining({
        status: 'up',
        used: expect.any(Number),
        total: expect.any(Number)
      }));
    });

    it('should provide disk usage information', async () => {
      const response = await request(app.getHttpServer())
        .get('/health')
        .expect(200);

      const storage = response.body.details.storage;

      expect(storage).toEqual(expect.objectContaining({
        status: 'up',
        used: expect.any(Number),
        total: expect.any(Number)
      }));
    });
  });
});