import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(private readonly firebaseService: FirebaseService) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    return this.validateRequest(request);
  }

  async validateRequest(req: Request): Promise<boolean> {
    const token = req.headers.authorization;

    if (token != null && token != '') {
      try {
        const idToken = token.replace('Bearer ', '');

        const decodedToken = await this.firebaseService
          .auth()
          .verifyIdToken(idToken);
        const user = await this.firebaseService
          .auth()
          .getUser(decodedToken.uid);
        req['user'] = user;
        return true;
      } catch (error) {
        throw new UnauthorizedException(error);
      }
    } else {
      return false;
    }
  }
}
