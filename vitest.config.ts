import { defineConfig } from 'vitest/config';

export default defineConfig({
    plugins: [],
    test: {
        globals: true,
        environment: 'node',
        root: './',
        include: ['test/**/*.spec.ts'],
        setupFiles: ['test/setup-e2e.ts'],
        testTimeout: 30000,
        hookTimeout: 30000,
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'test/',
                '**/*.d.ts',
                '**/*.config.ts',
                '**/*.spec.ts',
                'src/main.ts',
                'dist/',
            ],
        },
        ui: true,
        api: {
            port: 51204,
            host: '127.0.0.1',
        },
    },
});