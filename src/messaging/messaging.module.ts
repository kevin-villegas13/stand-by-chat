import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DataBaseModule } from 'src/database/database.module';

@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: 'RABBITMQ_SERVICE',
        useFactory: () => ({
          transport: Transport.RMQ,
          options: {
            urls: [process.env.RABBITMQ_URL],
            queue: 'chat_queue',
            queueOptions: {
              durable: true,
            },
          },
        }),
      },
    ]),
    DataBaseModule,
  ],
  providers: [MessagingService],
  exports: [MessagingService],
})
export class MessagingModule {}
