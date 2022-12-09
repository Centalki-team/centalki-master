import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from 'nestjs-fireorm';
import { BaseFirestoreRepository } from 'fireorm';
import { SetRoleDto } from './dto/set-role.dto';
import { AuthCollection } from './collection/auth.collection';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthCollection)
    private authCollection: BaseFirestoreRepository<AuthCollection>,
    private readonly firebaseService: FirebaseService,
  ) {}
  async assignRole(dto: SetRoleDto) {
    let claims = null;
    try {
      claims = await this.firebaseService.auth().verifyIdToken(dto.idToken);
    } catch (e) {
      throw new BadRequestException('Cannot verify token!');
    }
    const uid = claims.uid;
    const exist = await this.authCollection.whereEqualTo('uid', uid).findOne();
    if (exist?.role) {
      throw new BadRequestException('User had authorized already!');
    } else {
      return this.authCollection.create({ uid, role: dto.role });
    }
  }

  async validateRole(dto: SetRoleDto) {
    let claims = null;
    try {
      claims = await this.firebaseService.auth().verifyIdToken(dto.idToken);
    } catch (e) {
      throw new BadRequestException('Cannot verify token!');
    }
    const uid = claims.uid;
    const exist = await this.authCollection.whereEqualTo('uid', uid).findOne();

    if (exist.role !== dto.role) {
      throw new ForbiddenException();
    } else {
      return exist;
    }
  }
  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
