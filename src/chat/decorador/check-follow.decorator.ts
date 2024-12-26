import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { DataBaseService } from 'src/database/database.service';

@Injectable()
export class CheckFollowGuard implements CanActivate {
  constructor(private readonly prisma: DataBaseService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const client = context.switchToWs().getClient();

    const userId = client.user;

    console.log(userId);

    


    return true;
  }
}
