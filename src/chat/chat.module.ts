import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagingModule } from 'src/messaging/messaging.module';
import { AuthModule } from 'src/auth/auth.module';
import { DataBaseModule } from 'src/database/database.module';

@Module({
  imports: [MessagingModule, AuthModule, DataBaseModule],
  providers: [ChatGateway],
})
export class ChatModule {}
