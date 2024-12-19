import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const WsEnableChat = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const client = ctx.switchToWs().getClient();
    return client.chatEnabled;
  },
);
