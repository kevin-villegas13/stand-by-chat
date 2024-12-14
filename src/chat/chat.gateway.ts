import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { MessagingService } from '../messaging/messaging.service';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private connectedUsers: Map<string, Socket> = new Map();

  constructor(private readonly messagingService: MessagingService) {}

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
    this.connectedUsers.set(client.id, client);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    this.connectedUsers.delete(client.id);
  }

  @SubscribeMessage('send_message')
  async handleMessage(
    client: Socket,
    payload: { to: string; message: string },
  ) {
    // Publicar mensaje en RabbitMQ
    await this.messagingService.publishMessage('chat_queue', payload);

    // Emitir mensaje al destinatario (si está conectado)
    const recipient = this.connectedUsers.get(payload.to);
    if (recipient) {
      recipient.emit('receive_message', payload);
    }
  }
}
