import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IToken } from './interface/token.interface';
import { DataBaseService } from 'src/database/database.service';
import { FollowUserDto } from './dto/follow-user.dto';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dbService: DataBaseService,
  ) {}

  async createUser(createUserDto: CreateUserDto): Promise<IToken> {
    const { username, email } = createUserDto;

    // Verificar si el correo o el nombre de usuario ya existen
    const existingUser = await this.dbService.user.findUnique({
      where: { email },
    });

    if (existingUser) throw new BadRequestException('El correo ya está en uso');

    const newUser = await this.dbService.user.create({
      data: {
        username,
        email,
      },
    });

    return {
      accessToken: await this.jwtService.signAsync({
        userId: newUser.username,
      }),
    };
  }

  async followUser(followUserDto: FollowUserDto): Promise<IToken> {
    const { followerUsername, followingUsername } = followUserDto;

    // Verificar si el usuario ya sigue a la otra persona
    const [follower, following] = await Promise.all([
      this.dbService.user.findUnique({ where: { username: followerUsername } }),
      this.dbService.user.findUnique({
        where: { username: followingUsername },
      }),
    ]);

    if (!follower || !following)
      throw new NotFoundException('Uno o ambos usuarios no existen');

    const existingFollow = await this.dbService.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: follower.id,
          followingId: following.id,
        },
      },
    });

    if (existingFollow) throw new NotFoundException('Ya sigues a este usuario');

    await this.dbService.follow.create({
      data: { followerId: follower.id, followingId: following.id },
    });

    return {
      accessToken: await this.jwtService.signAsync({
        username: follower.username,
      }),
    };
  }
}
