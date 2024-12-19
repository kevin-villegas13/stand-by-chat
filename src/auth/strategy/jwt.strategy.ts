import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { DataBaseService } from 'src/database/database.service';
import { IJwtPayload } from '../interface/jwt-payload';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly dbService: DataBaseService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: async (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'),
        };
      },
    });
  }

  async validate(payload: IJwtPayload): Promise<any> {
    try {
      const { username } = payload;

      const user = await this.dbService.user.findFirst({
        where: {
          username,
        },
      });

      if (!user) throw new UnauthorizedException();

      return user;
    } catch (error) {
      throw error;
    }
  }
}
