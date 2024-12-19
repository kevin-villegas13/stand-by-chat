import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { cors: true });

  app.useWebSocketAdapter(new IoAdapter(app));

  await app.listen(process.env.PORT || process.env.PORT);

  logger.log('');
  logger.log(`App running on port ${process.env.PORT}`);
  logger.log(`App running at ${process.env.HOST_API}`);
}
bootstrap();
