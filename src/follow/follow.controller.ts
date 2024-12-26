import { Controller, Post, Body, Request, UseGuards } from '@nestjs/common';
import { FollowService } from './follow.service';
import { JwtGuard } from 'src/auth/guard/jwt.guard';
import { VerifyFollowDto } from './dto/verify-follow.dto';

@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post('verify')
  @UseGuards(JwtGuard)
  async initiateChat(
    @Request() req: any,
    @Body() verifyFollowDto: VerifyFollowDto,
  ) {
    const isFollowed = await this.followService.verifyMutualFollow(
      req.user.username,
      verifyFollowDto.recipientId,
    );
    return { followed: isFollowed };
  }
}
