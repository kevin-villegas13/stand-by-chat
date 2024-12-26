import { IsString } from 'class-validator';

export class VerifyFollowDto {
  @IsString()
  recipientId: string;
}
