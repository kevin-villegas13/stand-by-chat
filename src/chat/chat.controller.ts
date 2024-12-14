import { Controller, Post, Body } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatGateway: ChatGateway) {}

  @Post('send_message')
  async sendMessage(@Body() body: { to: string; message: string }) {
    this.chatGateway.server.to(body.to).emit('receive_message', body);
    return { status: 'Message sent', data: body };
  }
}
