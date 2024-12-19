import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { MessagingService } from '../messaging/messaging.service';
import { Server, Socket } from 'socket.io';
import { WsChatAccessGuard } from '../auth/guard/ws-chat-access.guard';
import { WsEnableChat } from './decorators/ws-enable-chat.decorator';
import { UseGuards } from '@nestjs/common';
import { SaveMessageDto } from 'src/messaging/dto/save-message.dto';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(private readonly messagingService: MessagingService) {}

  // Manejar la conexión de un nuevo cliente
  handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);
  }

  // Manejar desconexión de un cliente
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Manejar evento de un mensaje nuevo
  @UseGuards(WsChatAccessGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    const senderId = Array.isArray(client.handshake.query.senderId)
      ? client.handshake.query.senderId[0]
      : client.handshake.query.senderId;

    const receiverId = Array.isArray(client.handshake.query.receiverId)
      ? client.handshake.query.receiverId[0]
      : client.handshake.query.receiverId;

    console.log(`Mensaje de ${senderId} a ${receiverId}: ${message}`);

    const saveMessageDto: SaveMessageDto = {
      senderId,
      receiverId,
      content: message,
    };
    await this.messagingService.saveMessage(saveMessageDto);

    // Publicar el mensaje en RabbitMQ
    this.messagingService.publishMessage('chat_queue', {
      senderId,
      receiverId,
      content: message,
    });

    // Escuchar mensajes en la cola de RabbitMQ
    this.messagingService.consumeMessage('chat_queue', (receivedMessage) => {
      console.log('Mensaje recibido de RabbitMQ:', receivedMessage);
      client.broadcast.emit('receiveMessage', receivedMessage.content);
    });

    // Emitir el mensaje a todos los clientes conectados
    client.broadcast.emit('receiveMessage', message);
  }
}
