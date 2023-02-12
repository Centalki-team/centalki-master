import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Auth } from 'firebase-admin/auth';
import { Request } from 'express';
import { FirebaseService } from 'src/firebase/firebase.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private auth: Auth;

  constructor(firebaseService: FirebaseService) {
    this.auth = firebaseService.auth();
  }
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const request = context.switchToHttp().getRequest() as Request;
    return this.validateRequest(request);
  }

  async validateRequest(req: Request): Promise<boolean> {
    const token = req.headers.authorization;
    if (token != null && token != '') {
      try {
        const decodedToken = await this.auth.verifyIdToken(
          token.replace('Bearer ', ''),
        );
        req['user'] = decodedToken;
        return true;
      } catch (error) {
        throw new UnauthorizedException(error);
      }
    } else {
      return false;
    }
  }
}
