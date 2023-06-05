import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Request } from 'express';
import { AuthCollection } from 'src/auth/collection/auth.collection';
import { ERole } from 'src/auth/enum/role.enum';
import { FirebaseService } from 'src/firebase/firebase.service';

const ROLE_SCORE = {
  [ERole.ADMIN]: 3,
  [ERole.TEACHER]: 2,
  [ERole.STUDENT]: 1,
};

const roleAllowed = (userRole: ERole, allowRole: ERole) => {
  if (ROLE_SCORE[userRole] >= ROLE_SCORE[allowRole]) {
    return true;
  }
  return false;
};

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseService: FirebaseService,
    private reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const role = this.reflector.get<ERole>('role', context.getHandler());
    const request = context.switchToHttp().getRequest() as Request;
    return this.validateRequest(request, role);
  }

  async validateRequest(req: Request, role: ERole): Promise<boolean> {
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
        const profileQuery = await this.firebaseService
          .firestore()
          .collection('AuthCollections')
          .where('uid', '==', user.uid)
          .get();
        const profile = profileQuery.docs.pop().data() as AuthCollection;
        if (!!role && !roleAllowed(profile.role, role)) {
          return false;
        }
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

@Injectable()
export class OptionalFirebaseAuthGuard implements CanActivate {
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
        return true;
      }
    } else {
      return true;
    }
  }
}
