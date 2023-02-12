import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';

export const User = createParamDecorator((_: string, ctx: ExecutionContext) => {
  const request = ctx
    .switchToHttp()
    .getRequest<Request & { user: UserRecord }>();
  const user = request.user;
  return user;
});
