import { Module } from '@nestjs/common';
import { MessagingModule } from './messaging/messaging.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import { DataBaseService } from './database/database.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    MessagingModule,
    ChatModule,
  ],
  providers: [DataBaseService],
})
export class AppModule {}
