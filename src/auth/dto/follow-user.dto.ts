import { IsString } from 'class-validator';

export class FollowUserDto {
  @IsString()
  followerUsername: string;

  @IsString()
  followingUsername: string;
}
