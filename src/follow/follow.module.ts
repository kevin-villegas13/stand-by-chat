import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { DataBaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule, DataBaseModule],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
