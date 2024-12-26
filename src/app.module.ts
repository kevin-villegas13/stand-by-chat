import { Module } from '@nestjs/common';
import { MessagingModule } from './messaging/messaging.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { DataBaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';
import { FollowModule } from './follow/follow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    MessagingModule,
    ChatModule,
    FollowModule,
  ],
  providers: [DataBaseService],
})
export class AppModule {}
