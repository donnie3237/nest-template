import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import { apiReference } from '@scalar/nestjs-api-reference'
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Docs')
    .setDescription('The API documentation')
    .build()

  const document = SwaggerModule.createDocument(app, config)

  app.use(
    '/docs',
    apiReference({
      content: document,
      hideClientButton: true,
    }),
  );

  // Start microservice (example with RMQ transport)
  // const microservice = await app.connectMicroservice<MicroserviceOptions>({
  //   transport: Transport.RMQ,
  //   options: {
  //     urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
  //     queue: 'user_queue',
  //     queueOptions: { durable: false }
  //   },
  // });
  // await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();



