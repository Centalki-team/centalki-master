import { Request } from 'express';
import {
  applyDecorators,
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { UserRecord } from 'firebase-admin/auth';
import { ERole } from 'src/auth/enum/role.enum';
import { ApiBearerAuth, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FirebaseAuthGuard } from 'src/global/guard';

export const User = createParamDecorator((_: string, ctx: ExecutionContext) => {
  const request = ctx
    .switchToHttp()
    .getRequest<Request & { user: UserRecord }>();
  const user = request.user;
  return user;
});

export function Auth(role: ERole) {
  return applyDecorators(
    SetMetadata('role', role),
    ApiBearerAuth(),
    UseGuards(FirebaseAuthGuard),
    ApiUnauthorizedResponse({ description: 'Unauthorized' }),
  );
}
