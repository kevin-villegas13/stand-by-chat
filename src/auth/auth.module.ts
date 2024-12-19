import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { DataBaseModule } from 'src/database/database.module';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategy/jwt.strategy';
import { JwtGuard } from './guard/jwt.guard';
import { AuthService } from './auth.service';
import { WsChatAccessGuard } from './guard/ws-chat-access.guard';

@Module({
  imports: [
    DataBaseModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtGuard, WsChatAccessGuard],
  exports: [JwtModule, PassportModule, AuthService],
})
export class AuthModule {}
