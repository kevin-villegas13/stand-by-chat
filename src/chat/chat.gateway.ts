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
import { JwtWsAuthGuard } from 'src/auth/guard/jwt-socket.guard';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SaveMessageDto } from 'src/messaging/dto/save-message.dto';

@WebSocketGateway({ namespace: 'chat', cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  constructor(
    private readonly messagingService: MessagingService,
    private readonly chatService: ChatService,
  ) {}

  // Manejar la conexión de un nuevo cliente
  async handleConnection(client: Socket) {
    console.log(`Cliente conectado: ${client.id}`);

    const chatId = Array.isArray(client.handshake.query.chatId)
      ? client.handshake.query.chatId[0]
      : client.handshake.query.chatId;

    // Validar que el chat existe
    const chatExists = await this.chatService.isChatValid(chatId);

    if (chatExists) {
      client.data.chatId = chatId;

      // Unir al cliente a una sala específica para el chat
      client.join(`chat-${chatId}`);
      console.log(`Cliente ${client.id} conectado a la sala chat-${chatId}`);

      // Emitir evento solo al cliente que se conecta
      client.emit('chatEnabled', {
        message: 'Chat habilitado exitosamente',
        chatId: chatId,
      });
    } else {
      console.log(
        `El chat con ID ${chatId} no es válido. Desconectando cliente.`,
      );
      client.disconnect();
    }
  }

  // Manejar desconexión de un cliente
  handleDisconnect(client: Socket) {
    console.log(`Cliente desconectado: ${client.id}`);
  }

  // Manejar evento de un mensaje nuevo
  @UseGuards(JwtWsAuthGuard)
  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: string,
  ) {
    const chatId = Array.isArray(client.handshake.query.chatId)
      ? client.handshake.query.chatId[0]
      : client.handshake.query.chatId;

    const saveMessageDto: SaveMessageDto = {
      chatId: Number(chatId),
      content: message,
    };
    await this.messagingService.saveMessage(saveMessageDto);

    // Publicar el mensaje en RabbitMQ
    this.messagingService.publishMessage('chat_queue', {
      chatId,
      content: message,
    });

    // Escuchar mensajes en la cola de RabbitMQ
    this.messagingService.consumeMessage('chat_queue', (receivedMessage) => {
      console.log('Mensaje recibido de RabbitMQ:', receivedMessage);
      client.broadcast.emit('receiveMessage', receivedMessage.content);
    });

    client.broadcast.emit('receiveMessage', message);
  }
}
