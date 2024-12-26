import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { MessagingModule } from 'src/messaging/messaging.module';
import { AuthModule } from 'src/auth/auth.module';
import { DataBaseModule } from 'src/database/database.module';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { FollowModule } from 'src/follow/follow.module';

@Module({
  imports: [MessagingModule, AuthModule, DataBaseModule],
  providers: [ChatGateway, ChatService],
  controllers: [ChatController],
})
export class ChatModule {}
