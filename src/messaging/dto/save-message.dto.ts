import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class SaveMessageDto {
  @IsUUID()
  chatId: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
