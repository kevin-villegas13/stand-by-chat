import { Injectable, NotFoundException } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';
import { ChatDetails } from './interface/chat-detail.interface';

@Injectable()
export class ChatService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async habiliteCreateChat(
    username: string,
    recipientId: string,
  ): Promise<ChatDetails> {
    const nameUser = await this.dataBaseService.user.findFirst({
      where: {
        username: username,
      },
    });

    const chat = await this.dataBaseService.chat.findFirst({
      where: {
        ChatsOnUsers: {
          every: { userId: { in: [nameUser.id, recipientId] } },
        },
      },
      include: { ChatsOnUsers: { include: { user: true } } },
    });

    if (chat)
      throw new NotFoundException(
        'El chat ya está habilitado entre estos usuarios',
      );

    // Crear un nuevo chat si no existe
    const newChat = await this.dataBaseService.chat.create({
      data: {
        ChatsOnUsers: {
          create: [{ userId: nameUser.id }, { userId: recipientId }],
        },
      },
      include: { ChatsOnUsers: { include: { user: true } } },
    });

    // Formatear y devolver la respuesta del nuevo chat
    return {
      id: newChat.id,
      users: newChat.ChatsOnUsers.map(({ user }) => ({
        id: user.id,
        username: user.username,
      })),
      createdAt: newChat.createdAt,
    };
  }

  async isChatValid(chatId: string): Promise<boolean> {
    if (!chatId || isNaN(Number(chatId))) {
      return false;
    }

    const chat = await this.dataBaseService.chat.findUnique({
      where: { id: Number(chatId) },
    });

    return chat ? true : false;
  }
}
