import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { DataBaseService } from 'src/database/database.service';

@Injectable()
export class WsChatAccessGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly dbService: DataBaseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();
    const token = client.handshake.headers['authorization']?.split(' ')[1];

    if (!token) return false;

    try {
      // Verificar el token
      const decoded = await this.jwtService.verifyAsync(token);
      client.user = decoded;

      // Obtener los IDs de los usuarios
      const senderId = client.handshake.query.senderId;
      const receiverId = client.handshake.query.receiverId;

      const sharedChat = await this.dbService.chatsOnUsers.findFirst({
        where: {
          userId: { in: [senderId, receiverId] },
        },
      });

      client.chatEnabled = !!sharedChat;
      return !!sharedChat;
    } catch (error) {
      console.error('Error in token verification or relationship check', error);
      return false;
    }
  }
}
