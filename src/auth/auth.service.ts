import {
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import * as crypto from 'crypto';
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
import { SetDeviceTokenDto } from './dto/set-device-token.dto';
import { ESessionScheduleStatus } from 'src/session-schedule/enum/session-schedule-status.enum';
import { PutSpeakingLevels } from './dto/put-speaking-levels.dto';
import { PutInterestedTopics } from './dto/put-interested-topics.dto';
import { CertificateService } from 'src/certificate/certificate.service';

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
    @Inject(forwardRef(() => CertificateService))
    private readonly certificateService: CertificateService,
  ) {
    // this.loginBiometric();
  }

  paginateSessions(query: PaginateSessionDto, user: UserRecord) {
    return this.sessionService.paginate(query, user);
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
      return this.authCollection.create({
        uid,
        role: dto.role,
        deviceTokens: [],
      });
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
    const uid = user.uid;
    const fetchRole = this.authCollection.whereEqualTo('uid', uid).findOne();
    const fetchProfile = this.userProfileRepository
      .whereEqualTo('uid', uid)
      .findOne();
    const completedSession = await this.sessionService.countSession(
      uid,
      ESessionScheduleStatus.COMPLETED,
    );
    const [role, profile, certificates] = await Promise.all([
      fetchRole,
      fetchProfile,
      this.certificateService.findByUserId(uid),
    ]);
    return {
      role,
      completedSession,
      profile,
      certificates,
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
  async getCostPerSession(uid) {
    const profile = await this.userProfileRepository
      .whereEqualTo('uid', uid)
      .findOne();
    return {
      costPerSession: profile.costPerSession,
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

  async putSpeakingLevels(user: UserRecord, dto: PutSpeakingLevels) {
    const uid = user.uid;
    const profile = await this.userProfileRepository
      .whereEqualTo('uid', uid)
      .findOne();
    const newSpeakingLevels = dto.speakingLevelIds || [];
    profile.speakingLevelIds = newSpeakingLevels;
    return await this.userProfileRepository.update(profile);
  }

  async putInterestedTopics(user: UserRecord, dto: PutInterestedTopics) {
    const uid = user.uid;
    const profile = await this.userProfileRepository
      .whereEqualTo('uid', uid)
      .findOne();
    const interestedTopicIds = dto.interestedTopicIds || [];
    profile.interestedTopicIds = interestedTopicIds;
    return await this.userProfileRepository.update(profile);
  }

  async findOrThrow(uid: string) {
    const user = await this.firebaseService
      .auth()
      .getUser(uid)
      .catch(() => null);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return user;
  }

  // loginBiometric() {
  //   // The message that was signed
  //   const message = 'Hello, world!';

  //   // The digital signature
  //   const signature =
  //     'oPhWQo/yLcfqHti9E3ZH57d7UEZDjOhs5grDrFuEDULgIUUd/LSS2NLvLsrFQ96VzoYxLue0ziToVBjyWubrNO+kcbu020thaiDcWQ+quRYtcEDbjfSv1JNzB/9F52dbTXvr8hSDnGNVa1vYK/WMC9zhx6uwItemh/nZygBrPi9hFW2WIZuQrrqvIyOA27h9IrnEIZJ6OQbq8dCw9WgnyN3BNwmyaj63ZAcVrwQyxfXc1Jjovfah3SXMle94cHSNxqkm2y4u3Dj2cHpFhXPRxMfxHu6ZObsbwqjfzTEu6GPINQFGXabmCKJzO+urvA0WEhpHKqkNgLmpnqHVCzp/SA==';

  //   // The public key in PEM format
  //   const publicKey =
  //     '-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA26vt7dbR1QU5h1esJkHf+qLAnEGu8FqEbL9pL9FXjCM97YhUGQrz7rBLj9E0+osK6NlaZu6EF3Xk9CxgFfptgb05IkjzdG6RCLe560o50g7bWk167K9GFh1pg5tVluHFSxAsVsqCn+72lREZW0afBVRXJnt3Gc0AjIvDLLOEJ81NHOFFr0nGBpSJUFPCq4TTTHB+Bf4lDW7LEEdcPI/O8zKGwYKy9AvCTQMGWMcwpB+rJYwxx7Knp3qbIrP1hnGB0RtXpbRflCA5MGGLYhHfyn8Bz0pM0NYwRoBhXBw2Seu3rxYpUWgY+b/OHBeqnWILaQPtcoc4jfXw5TIdrUTWtQIDAQAB\n-----END PUBLIC KEY-----';

  //   // Verify the digital signature using the public key
  //   const verifier = crypto.createVerify('SHA256');
  //   verifier.update(message);
  //   const verified = verifier.verify(publicKey, signature, 'base64');

  //   if (verified) {
  //     console.log('Signature is valid');
  //   } else {
  //     console.log('Signature is not valid');
  //   }
  // }
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

  async addDeviceToken(user: UserRecord, dto: SetDeviceTokenDto) {
    const uid = user.uid;
    const exist = await this.authCollection.whereEqualTo('uid', uid).findOne();
    exist.deviceTokens = [...exist.deviceTokens, dto.token];
    return await this.authCollection.update(exist);
  }

  async updateBalance(uid: string, amount: number) {
    if (!uid && !amount) {
      return false;
    }
    const profile = await this.userProfileRepository
      .whereEqualTo('uid', uid)
      .findOne();
    profile.balance = (profile.balance || 0) + amount;
    return this.userProfileRepository.update(profile);
  }
}
