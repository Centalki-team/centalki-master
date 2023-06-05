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

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  constructor(
    private readonly firebaseService: FirebaseService,
    private reflector: Reflector,
  ) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const roles =
      this.reflector.get<ERole[]>('roles', context.getHandler()) || [];
    const request = context.switchToHttp().getRequest() as Request;
    return this.validateRequest(request, roles);
  }

  async validateRequest(req: Request, roles: ERole[]): Promise<boolean> {
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
        if (roles.length && !roles.includes(profile.role)) {
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
