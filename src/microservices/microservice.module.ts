import { Module } from '@nestjs/common';
import { ClientProxyFactory, ClientsModule, Transport } from '@nestjs/microservices';
import { UserMessage } from './subscriber/users.message'
import { ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'user_service',
                transport: Transport.RMQ,
                options: {
                    urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
                    queue: 'user_queue',
                    queueOptions: {
                        durable: false
                    },
                },
            },
        ]),
    ],
    controllers: [UserMessage],
    providers: [
        {
            provide: 'some_service',
            useFactory: (configService: ConfigService) => {
                return ClientProxyFactory.create({
                    transport: Transport.RMQ,
                    options: {
                        urls: [configService.get('rabbitmq.urls')],
                        queue: 'some_queue',
                        queueOptions: {
                            durable: false
                        },
                    },
                });
            },
        },
    ],
})
export class MicroserviceModule { }