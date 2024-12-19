import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class SaveMessageDto {
  @IsUUID()
  @IsNotEmpty()
  senderId: string;

  @IsUUID()
  @IsNotEmpty()
  receiverId: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
