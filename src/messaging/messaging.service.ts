import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { Inject } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { SaveMessageDto } from './dto/save-message.dto';

@Injectable()
export class MessagingService {
  constructor(
    @Inject('RABBITMQ_SERVICE') private readonly client: ClientProxy,
    private readonly dataService: DataBaseService,
  ) {}

  async onModuleInit() {
    try {
      console.log('Intentando conectar a RabbitMQ...');
      await this.client.connect();
      console.log('Conexión a RabbitMQ exitosa');
    } catch (error) {
      console.error('Error al conectar a RabbitMQ:', error);
    }
  }

  // Para emitir un mensaje a la cola
  async publishMessage(queue: string, message: any) {
    console.log(`Enviando mensaje a la cola ${queue}:`, message);
    return this.client.emit(queue, message);
  }

  // Para consumir un mensaje de la cola (debe ser llamado en el controlador o en un gateway)
  async consumeMessage(queue: string, callback: (message: any) => void) {
    console.log(`Escuchando mensajes en la cola ${queue}`);
    this.client.send(queue, {}).subscribe(async (message) => {
      callback(message);
    });
  }

  async saveMessage(saveMessageDto: SaveMessageDto) {
    const { senderId, receiverId, content } = saveMessageDto;

    const chat = await this.dataService.chatsOnUsers.findFirst({
      where: {
        userId: { in: [senderId, receiverId] },
      },
      include: {
        chat: true,
      },
    });

    if (!chat) throw new NotFoundException('No chat exists between the users');

    const newMessage = await this.dataService.message.create({
      data: {
        content,
        chatId: chat.chatId,
      },
    });

    return newMessage;
  }
}
