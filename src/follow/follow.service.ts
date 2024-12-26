import { Injectable, NotFoundException } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';

@Injectable()
export class FollowService {
  constructor(private readonly dataBaseService: DataBaseService) {}

  async verifyMutualFollow(
    username: string,
    recipientId: string,
  ): Promise<boolean> {
    const nameUser = await this.dataBaseService.user.findFirst({
      where: {
        username: username,
      },
    });

    const follows = await this.dataBaseService.follow.findMany({
      where: {
        OR: [
          { followerId: nameUser.id, followingId: recipientId },
          { followerId: recipientId, followingId: nameUser.id },
        ],
      },
    });

    if (follows.length === 0)
      throw new NotFoundException('At least one user must follow the other.');

    return true;
  }
}
