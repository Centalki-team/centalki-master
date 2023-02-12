import { Request } from 'express';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DecodedIdToken } from 'firebase-admin/auth';

export const User = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx
      .switchToHttp()
      .getRequest<Request & { user: DecodedIdToken }>();
    const user = request.user;

    return key ? user?.[key] : user;
  },
);
