import { Module } from '@nestjs/common';
import { MessagingModule } from './messaging/messaging.module';
import { ChatModule } from './chat/chat.module';
import { ConfigModule } from '@nestjs/config';
import configuration from 'src/common/config/configuration';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MessagingModule,
    ChatModule,
  ],
})
export class AppModule {}
