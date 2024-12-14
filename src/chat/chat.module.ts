import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagingModule } from 'src/messaging/messaging.module';
import { ChatController } from './chat.controller';

@Module({
  imports: [MessagingModule],
  providers: [ChatGateway],
  controllers: [ChatController],
})
export class ChatModule {}
