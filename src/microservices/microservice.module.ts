import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'user_service',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'microservice_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
    ],
    controllers: [],
    providers: [
        {
            provide: 'some_service',
            useFactory: (client) => {
                return {
                    // Define your microservice methods here
                };
            },
        },
    ],
})
export class MicroserviceModule { }