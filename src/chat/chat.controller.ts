import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { VerifyFollowDto } from 'src/follow/dto/verify-follow.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('initiate')
  @UseGuards(JwtGuard)
  async initiateChat(
    @Request() req: any,
    @Body() verifyFollowDto: VerifyFollowDto,
  ) {
    const chatDetails = await this.chatService.habiliteCreateChat(
      req.user.username,
      verifyFollowDto.recipientId,
    );

    return chatDetails;
  }
}
