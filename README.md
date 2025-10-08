# 🚀 NestJS Enterprise Template

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

<p align="center">
  A comprehensive, production-ready NestJS template with modern development practices, testing, caching, messaging, and monitoring capabilities.
</p>

<p align="center">
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
  <img src="https://img.shields.io/badge/TypeScript-5.7-blue" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Testing-Vitest-green" alt="Vitest" />
  <img src="https://img.shields.io/badge/Database-PostgreSQL-blue" alt="PostgreSQL" />
</p>

## ✨ Features

### 🏗️ **Core Architecture**
- **NestJS 11.x** - Latest stable version with TypeScript
- **Modular Architecture** - Well-organized, scalable module structure
- **Configuration Management** - Environment-based config with validation
- **Exception Handling** - Custom exceptions and global error filters
- **API Documentation** - Swagger/OpenAPI with Scalar integration

### 🗄️ **Database & ORM**
- **TypeORM 0.3.20** - Modern ORM with PostgreSQL support
- **Database Migrations** - Version-controlled schema changes
- **Entity Relationships** - Properly structured data models
- **Connection Pooling** - Optimized database connections

### 🚀 **Performance & Caching**
- **Redis Integration** - High-performance caching with Keyv
- **Method-level Caching** - `@Cacheable` decorator support
- **Cache Management** - Full cache lifecycle with invalidation
- **Memory Optimization** - Efficient resource utilization

### 📡 **Messaging & Communication**
- **RabbitMQ Integration** - Reliable message queuing
- **Microservices Ready** - Message-based architecture support
- **Event-driven Architecture** - Asynchronous processing capabilities

### 🧪 **Testing & Quality**
- **Vitest Testing** - Modern, fast testing framework
- **E2E Testing** - Comprehensive integration tests
- **Test UI** - Visual test runner interface
- **Code Coverage** - Detailed testing metrics
- **ESLint + Prettier** - Code quality and formatting

### 🔍 **Monitoring & Health**
- **Health Checks** - Database, memory, and disk monitoring
- **Terminus Integration** - Advanced health check capabilities
- **Logging** - Structured logging with context
- **Performance Metrics** - Application performance monitoring

### 🐳 **Development & Deployment**
- **Docker Support** - Multi-service development environment
- **Environment Management** - Development, testing, and production configs
- **Hot Reload** - Fast development iteration
- **Build Optimization** - Production-ready builds

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Docker & Docker Compose
- PostgreSQL 14+
- Redis 6+
- RabbitMQ 3.11+

### Installation

```bash
# Clone the repository
git clone <your-repo-url> nest-template
cd nest-template

# Install dependencies
pnpm install

# Copy environment file
cp .env.example .env

# Start development services (PostgreSQL, Redis, RabbitMQ)
docker-compose up -d

# Run database migrations
pnpm run migration:run

# Start development server
pnpm run start:dev
```

### Environment Setup

Update your `.env` file with your configuration:

```bash
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_DATABASE=nest_template

# Redis Configuration
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# RabbitMQ Configuration
RABBITMQ_URL=amqp://guest:guest@localhost:5672
```

## 📚 Available Scripts

### Development
```bash
pnpm run start:dev      # Start development server with hot reload
pnpm run start:prod     # Start production server
pnpm run build          # Build for production
pnpm run format         # Format code with Prettier
```

### Testing
```bash
pnpm run test           # Run unit tests
pnpm run test:watch     # Run tests in watch mode
pnpm run test:ui        # Open Vitest UI for interactive testing
pnpm run test:e2e       # Run E2E tests with UI
```

### Database
```bash
pnpm run migration:generate  # Generate new migration
pnpm run migration:run       # Run pending migrations
pnpm run migration:revert    # Revert last migration
pnpm run schema:sync         # Sync schema (development only)
```

## 🏗️ Project Structure

```
src/
├── cache/                 # Caching module with Redis integration
│   ├── cache.module.ts
│   ├── cache.service.ts
│   ├── cache.decorator.ts
│   └── cache.interceptor.ts
├── config/                # Configuration modules
│   ├── database.config.ts
│   ├── redis.config.ts
│   └── rabbitmq.config.ts
├── database/             # Database related files
│   └── migrations/       # Database migrations
├── exceptions/           # Custom exceptions and filters
│   ├── custom.exceptions.ts
│   └── http-exception.filter.ts
├── health/              # Health check module
│   ├── health.module.ts
│   └── health.controller.ts
├── microservices/       # Message queue services
│   ├── rabbitmq.service.ts
│   └── redis.service.ts
├── modules/             # Business logic modules
│   └── users/           # Example user module
├── app.module.ts        # Main application module
└── main.ts             # Application entry point

test/
├── e2e/                # End-to-end tests
├── setup-e2e.ts       # E2E test setup
└── vitest-e2e.config.ts # E2E test configuration
```

## 🔧 Module Usage Examples

### Cache Module
```typescript
// Automatic method caching
@Get(':id')
@Cacheable({ key: 'user:{0}', ttl: 600 })
async getUser(@Param('id') id: string) {
  return this.userService.findOne(id);
}

// Manual cache operations
await this.cacheService.set('key', value, 300);
const cached = await this.cacheService.get('key');
```

### Exception Handling
```typescript
// Custom exceptions
throw new UserNotFoundException(userId);
throw new ValidationException(['Email is required']);
throw new BusinessLogicException('Invalid operation');

// Global exception filter automatically handles formatting
```

### Health Checks
```typescript
// Access health endpoint
GET /health

// Returns comprehensive health status
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up", "used": 45, "total": 100 },
    "storage": { "status": "up", "used": 65, "total": 100 }
  }
}
```

## 🧪 Testing

### Unit Tests
```bash
# Run all unit tests
pnpm run test

# Run tests in watch mode
pnpm run test:watch

# Open Vitest UI
pnpm run test:ui
```

### E2E Tests
```bash
# Run E2E tests with UI
pnpm run test:e2e

# Test specific modules
pnpm vitest test/e2e/users.spec.ts
```

The template includes comprehensive test examples:
- **User API Tests** - CRUD operations, validation, error handling
- **Health Check Tests** - System monitoring and status checks
- **Cache Tests** - Cache operations and performance validation

## 🔍 API Documentation

Once the server is running, access the API documentation:

- **Swagger UI**: http://localhost:3000/api
- **Scalar Docs**: http://localhost:3000/reference
- **Health Check**: http://localhost:3000/health

## 🐳 Docker Development

The template includes a complete Docker setup:

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services included:
- **PostgreSQL** (ports 5432/5433)
- **Redis** (ports 6379/6380) 
- **RabbitMQ** (ports 5672/5673, Management UI: 15672/15673)

## 🛠️ Customization

### Adding New Modules
```bash
# Generate new module
nest g module products
nest g controller products
nest g service products

# Add to app.module.ts imports
```

### Database Entities
```typescript
// Create new entity
@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;
}

# Generate migration
pnpm run migration:generate AddProductEntity
```

### Custom Exceptions
```typescript
export class ProductNotFoundException extends HttpException {
  constructor(productId: string) {
    super({
      message: `Product with ID ${productId} not found`,
      error: 'PRODUCT_NOT_FOUND',
      statusCode: HttpStatus.NOT_FOUND,
    }, HttpStatus.NOT_FOUND);
  }
}
```

## 🚀 Production Deployment

### Build & Deploy
```bash
# Build for production
pnpm run build

# Start production server
pnpm run start:prod

# With PM2 (recommended)
pm2 start dist/main.js --name "nest-template"
```

### Environment Variables
Ensure all production environment variables are properly set:
- Database credentials
- Redis connection
- RabbitMQ URL
- JWT secrets (if using authentication)
- External service URLs

### Performance Considerations
- Enable database connection pooling
- Configure Redis clustering for high availability
- Set up proper logging and monitoring
- Implement rate limiting for public APIs
- Use CDN for static assets

## 📈 Monitoring & Maintenance

### Health Monitoring
- Use `/health` endpoint for liveness/readiness probes
- Monitor database connection status
- Track memory and disk usage
- Set up alerts for service failures

### Performance Monitoring
- Monitor cache hit rates
- Track API response times
- Watch database query performance
- Analyze memory usage patterns

### Maintenance Tasks
- Regular database maintenance
- Cache cleanup and optimization
- Log rotation and cleanup
- Security updates and patches

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write comprehensive tests for new features
- Update documentation for API changes
- Use conventional commit messages
- Ensure all tests pass before submitting PR

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [NestJS](https://nestjs.com/) - The progressive Node.js framework
- [Vitest](https://vitest.dev/) - Next generation testing framework
- [TypeORM](https://typeorm.io/) - Amazing ORM for TypeScript
- [Redis](https://redis.io/) - In-memory data structure store
- [RabbitMQ](https://www.rabbitmq.com/) - Message broker

---

<p align="center">
  Made with ❤️ for modern Node.js applications
</p>