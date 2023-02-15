import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from 'nestjs-fireorm';
import { BaseFirestoreRepository } from 'fireorm';
import { SetRoleDto } from './dto/set-role.dto';
import { AuthCollection } from './collection/auth.collection';
import { FirebaseService } from '../firebase/firebase.service';
import { UserProfile } from './collection/user-profile';
import { UpdateRequest, UserRecord } from 'firebase-admin/auth';
import { UpdateProfileDto } from './dto/update-profile.dto';

import { merge } from 'src/global/fn';
import { SessionScheduleService } from 'src/session-schedule/session-schedule.service';
import { PaginateSessionDto } from 'src/session-schedule/dto/get-session.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AuthCollection)
    private authCollection: BaseFirestoreRepository<AuthCollection>,
    @InjectRepository(UserProfile)
    private userProfileRepository: BaseFirestoreRepository<UserProfile>,
    private readonly firebaseService: FirebaseService,
    @Inject(forwardRef(() => SessionScheduleService))
    private readonly sessionService: SessionScheduleService,
  ) {}

  paginateSessions(query: PaginateSessionDto) {
    return this.sessionService.paginate(query);
  }

  async assignRole(dto: SetRoleDto) {
    const displayName = dto.displayName;
    let claims = null;
    try {
      claims = await this.firebaseService.auth().verifyIdToken(dto.idToken);
    } catch (e) {
      throw new BadRequestException('Cannot verify token!');
    }
    const uid = claims.uid;
    const exist = await this.authCollection.whereEqualTo('uid', uid).findOne();
    const userProfile = new UserProfile();
    userProfile.uid = uid;

    if (displayName) {
      await this.firebaseService.auth().updateUser(uid, {
        displayName,
      });
    }

    await this.userProfileRepository.create(userProfile);
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
    console.log({ exist, uid, claims, dto });
    if (!exist) {
      throw new NotFoundException('User not exist');
    }

    if (exist.role !== dto.role) {
      throw new ForbiddenException();
    } else {
      return exist;
    }
  }
  async getUserProfile(user: UserRecord) {
    console.log({ user });

    const uid = user.uid;
    const fetchRole = this.authCollection.whereEqualTo('uid', uid).findOne();
    const fetchProfile = this.userProfileRepository
      .whereEqualTo('uid', uid)
      .findOne();
    const [role, profile] = await Promise.all([fetchRole, fetchProfile]);
    return {
      role,
      profile,
      ...user,
    };
  }
  async getBalance(user: UserRecord) {
    const uid = user.uid;
    const profile = await this.userProfileRepository
      .whereEqualTo('uid', uid)
      .findOne();
    return {
      balance: profile.balance,
      costPerSession: profile.costPerSession,
      currency: profile.currency,
      displayBalance: `${profile.balance} ${profile.currency}`.toUpperCase(),
      displayCostPerSession:
        `${profile.costPerSession} ${profile.currency}`.toUpperCase(),
    };
  }
  async canRequestSession(uid: string): Promise<boolean> {
    const profile = await this.userProfileRepository
      .whereEqualTo('uid', uid)
      .findOne();
    return profile.balance >= profile.costPerSession;
  }
  async updateUserProfile(user: UserRecord, dto: UpdateProfileDto) {
    const uid = user.uid;
    const mergedUserRecord = merge<UpdateRequest>(user, dto) as UpdateRequest;
    await this.firebaseService.auth().updateUser(uid, mergedUserRecord);
    let profile = await this.userProfileRepository
      .whereEqualTo('uid', uid)
      .findOne();
    if (!profile) {
      profile = await this.userProfileRepository.create({
        uid,
        ...new UserProfile(),
      });
    }
    const mergedUserProfile = merge<UserProfile>(profile, dto);
    profile = {
      ...profile,
      ...mergedUserProfile,
    };
    await this.userProfileRepository.update(profile);

    return {
      profile,
    };

    // const profile = await Promise.all([fetchRole, fetchProfile]);
    // return {
    //   role,
    //   profile,
    //   ...user,
    // };
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
