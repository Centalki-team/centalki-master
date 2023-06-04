import {
  BadGatewayException,
  BadRequestException,
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
// import * as crypto from 'crypto';
import * as nodemailer from 'nodemailer';
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
import { ERole } from 'src/auth/enum/role.enum';
import { PutInitialLevelDto } from 'src/auth/dto/put-initial-level.dto';
import { EInitialLevelType } from 'src/auth/enum/initial-level.enum';
import { TopicService } from 'src/topic/topic.service';
import { SendVerifyEmailDto } from 'src/auth/dto/send-verify-email.dto';

@Injectable()
export class AuthService {
  mailTransport: nodemailer.Transporter;
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
    private readonly topicService: TopicService,
  ) {
    this.mailTransport = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }
  isSSO(user: UserRecord) {
    const providerData = user.providerData || [];
    return providerData.some((item) =>
      ['facebook.com', 'google.com', 'apple.com'].includes(item.providerId),
    );
  }
  // async migrateProfile() {
  //   const list = (await this.firebaseService.auth().listUsers()).users;
  //   for (const item of list) {
  //     const profile = await this.userProfileRepository
  //       .whereEqualTo('uid', item.uid)
  //       .findOne();
  //     if (!profile) {
  //       console.log(`Start insert ${item.uid}`);
  //       const newProfile = new UserProfile();
  //       newProfile.uid = item.uid;
  //       await this.userProfileRepository.create(newProfile);
  //       console.log(`Success insert ${item.uid}`);
  //     }
  //   }
  // }

  async approveTeacher(email: string) {
    const user = await this.firebaseService.auth().getUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const exist = await this.authCollection
      .whereEqualTo('uid', user.uid)
      .findOne();
    if (exist) {
      exist.role = ERole.TEACHER;
      return await this.authCollection.update(exist);
    } else {
      return this.authCollection.create({
        uid: user.uid,
        role: ERole.TEACHER,
        deviceTokens: [],
      });
    }
  }

  paginateSessions(query: PaginateSessionDto, user: UserRecord) {
    return this.sessionService.paginate(query, user);
  }

  paginateTaughtSessions(query: PaginateSessionDto, user: UserRecord) {
    return this.sessionService.paginateTaught(query, user);
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

    const user = await this.firebaseService.auth().getUser(uid);

    const isSSOUser = this.isSSO(user);
    if (isSSOUser) {
      await this.firebaseService.auth().updateUser(uid, {
        emailVerified: true,
      });
    }
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
    if (role) {
      role.deviceTokens = null;
    }
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

  async getUserIdsByRole(role: ERole) {
    const authList = await this.authCollection
      .whereEqualTo('role', role)
      .find();
    return authList.map((item) => item.uid);
  }

  async getDeviceTokens(userIds: string[]) {
    const ids = [...userIds];
    const batches = [];

    while (ids.length) {
      // firestore limits batches to 10
      const batch = ids.splice(0, 10);

      // add the batch request to to a queue
      batches.push(this.authCollection.whereIn('uid', batch).find());
    }
    const resp = await Promise.all(batches);
    const authList = resp.flat();
    return authList
      .map((item) => item.deviceTokens)
      .flat()
      .filter((item) => !!item);
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
    exist.deviceTokens = exist.deviceTokens
      ? [...new Set([...exist.deviceTokens, dto.token])]
      : [dto.token];
    return await this.authCollection.update(exist);
  }

  async logOut(user: UserRecord, dto: SetDeviceTokenDto) {
    const uid = user.uid;
    const exist = await this.authCollection.whereEqualTo('uid', uid).findOne();
    exist.deviceTokens = exist.deviceTokens
      ? exist.deviceTokens.filter((item) => item !== dto.token)
      : [];
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

  async putInitialLevel(user: UserRecord, dto: PutInitialLevelDto) {
    const userProfile = await this.userProfileRepository
      .whereEqualTo('uid', user.uid)
      .findOne();
    if (!userProfile) {
      throw new NotFoundException();
    }

    if (
      dto.initialLevelType === EInitialLevelType.SPECIFIC &&
      !dto.initialLevelId
    ) {
      throw new BadGatewayException('Please provide the specific level!');
    }
    userProfile.initialLevelId = dto.initialLevelId || null;
    userProfile.initialLevelType = dto.initialLevelType || null;

    return await this.userProfileRepository.update(userProfile);
  }

  async getInterestedTopics(user: UserRecord) {
    const userProfile = await this.userProfileRepository
      .whereEqualTo('uid', user.uid)
      .findOne();
    if (!userProfile) {
      throw new NotFoundException();
    }
    const topicIds = userProfile.interestedTopicIds || [];
    if (!topicIds.length) {
      return [];
    } else {
      return this.topicService.findByIds(topicIds);
    }
  }

  async sendVerifyEmail(dto: SendVerifyEmailDto) {
    const generatedURL = await this.firebaseService
      .auth()
      .generateEmailVerificationLink(dto.email);

    // const urlParams = new URLSearchParams(generatedURL);
    // const oobCode = urlParams.get('oobCode');
    // console.log({ generatedURL, oobCode });

    // const verifyLink = `${process.env.DOMAIN}/verify-email?oobCode=${oobCode}`;
    await this.mailTransport.sendMail({
      from: `Centalki <noreply@firebase.com>`,
      to: dto.email,
      subject: 'Verify your email for Centalki',
      html: `<!DOCTYPE HTML PUBLIC "-//W3C//DTD XHTML 1.0 Transitional //EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
      <html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
      <head>
      <!--[if gte mso 9]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG/>
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
      <![endif]-->
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta name="x-apple-disable-message-reformatting">
        <!--[if !mso]><!--><meta http-equiv="X-UA-Compatible" content="IE=edge"><!--<![endif]-->
        <title></title>
        
          <style type="text/css">
            @media only screen and (min-width: 620px) {
        .u-row {
          width: 600px !important;
        }
        .u-row .u-col {
          vertical-align: top;
        }
      
        .u-row .u-col-100 {
          width: 600px !important;
        }
      
      }
      
      @media (max-width: 620px) {
        .u-row-container {
          max-width: 100% !important;
          padding-left: 0px !important;
          padding-right: 0px !important;
        }
        .u-row .u-col {
          min-width: 320px !important;
          max-width: 100% !important;
          display: block !important;
        }
        .u-row {
          width: 100% !important;
        }
        .u-col {
          width: 100% !important;
        }
        .u-col > div {
          margin: 0 auto;
        }
      }
      body {
        margin: 0;
        padding: 0;
      }
      
      table,
      tr,
      td {
        vertical-align: top;
        border-collapse: collapse;
      }
      
      p {
        margin: 0;
      }
      
      .ie-container table,
      .mso-container table {
        table-layout: fixed;
      }
      
      * {
        line-height: inherit;
      }
      
      a[x-apple-data-detectors='true'] {
        color: inherit !important;
        text-decoration: none !important;
      }
      
      table, td { color: #000000; } #u_body a { color: #0000ee; text-decoration: underline; } @media (max-width: 480px) { #u_content_image_4 .v-src-width { width: auto !important; } #u_content_image_4 .v-src-max-width { max-width: 43% !important; } #u_content_text_2 .v-container-padding-padding { padding: 35px 15px 10px !important; } #u_content_text_3 .v-container-padding-padding { padding: 10px 15px 40px !important; } }
          </style>
        
        
      
      <!--[if !mso]><!--><link href="https://fonts.googleapis.com/css?family=Lato:400,700&display=swap" rel="stylesheet" type="text/css"><!--<![endif]-->
      
      </head>
      
      <body class="clean-body u_body" style="margin: 0;padding: 0;-webkit-text-size-adjust: 100%;background-color: #c2e0f4;color: #000000">
        <!--[if IE]><div class="ie-container"><![endif]-->
        <!--[if mso]><div class="mso-container"><![endif]-->
        <table id="u_body" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;min-width: 320px;Margin: 0 auto;background-color: #c2e0f4;width:100%" cellpadding="0" cellspacing="0">
        <tbody>
        <tr style="vertical-align: top">
          <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top">
          <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td align="center" style="background-color: #c2e0f4;"><![endif]-->
          
      
      <div class="u-row-container" style="padding: 0px;background-color: transparent">
        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
          <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
            
      <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;" valign="top"><![endif]-->
      <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
        <div style="height: 100%;width: 100% !important;">
        <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;"><!--<![endif]-->
        
      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
          <tr>
            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:0px 0px 10px;font-family:arial,helvetica,sans-serif;" align="left">
              
        <table height="0px" align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse: collapse;table-layout: fixed;border-spacing: 0;mso-table-lspace: 0pt;mso-table-rspace: 0pt;vertical-align: top;border-top: 6px solid #6f9de1;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
          <tbody>
            <tr style="vertical-align: top">
              <td style="word-break: break-word;border-collapse: collapse !important;vertical-align: top;font-size: 0px;line-height: 0px;mso-line-height-rule: exactly;-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%">
                <span>&#160;</span>
              </td>
            </tr>
          </tbody>
        </table>
      
            </td>
          </tr>
        </tbody>
      </table>
      
      <table id="u_content_image_4" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
          <tr>
            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px;font-family:arial,helvetica,sans-serif;" align="left">
              
      <table width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="padding-right: 0px;padding-left: 0px;" align="center">
            
            <img align="center" border="0" src="https://firebasestorage.googleapis.com/v0/b/centalki-staging.appspot.com/o/meta%2Fcentalki.png?alt=media&token=c3151460-97ea-440d-ad26-b250ca60f191" alt="Logo" title="Logo" style="outline: none;text-decoration: none;-ms-interpolation-mode: bicubic;clear: both;display: inline-block !important;border: none;height: auto;float: none;width: 30%;max-width: 174px;" width="174" class="v-src-width v-src-max-width"/>
            
          </td>
        </tr>
      </table>
      
            </td>
          </tr>
        </tbody>
      </table>
      
        <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
        </div>
      </div>
      <!--[if (mso)|(IE)]></td><![endif]-->
            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      
      
      
      <div class="u-row-container" style="padding: 0px;background-color: transparent">
        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #ffffff;">
          <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #ffffff;"><![endif]-->
            
      <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
      <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
        <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
        <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
        
      <table id="u_content_text_2" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
          <tr>
            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:35px 55px 10px;font-family:arial,helvetica,sans-serif;" align="left">
              
        <div style="color: #333333; line-height: 180%; text-align: left; word-wrap: break-word;">
          <p style="font-size: 14px; line-height: 180%;"><span style="font-size: 18px; line-height: 32.4px; font-family: Lato, sans-serif;"><strong><span style="line-height: 32.4px; font-size: 18px;">Hi ${dto.email}, </span></strong></span></p>
      <p style="font-size: 14px; line-height: 180%;"> </p>
      <p style="line-height: 180%;"><span style="font-family: Lato, sans-serif;"><span style="font-size: 16px; line-height: 28.8px;">We're happy you signed up for Centalki. To start speaking with Centalki, please confirm your email address.</span></span></p>
        </div>
      
            </td>
          </tr>
        </tbody>
      </table>
      
      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
          <tr>
            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:20px 10px 30px;font-family:arial,helvetica,sans-serif;" align="left">
              
        <!--[if mso]><style>.v-button {background: transparent !important;}</style><![endif]-->
      <div align="center">
        <!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="https://firebasestorage.googleapis.com/v0/b/centalki-staging.appspot.com/o/meta%2Fcentalki.png?alt=media&token=c3151460-97ea-440d-ad26-b250ca60f191" style="height:57px; v-text-anchor:middle; width:269px;" arcsize="77%"  stroke="f" fillcolor="#33428d"><w:anchorlock/><center style="color:#FFFFFF;font-family:arial,helvetica,sans-serif;"><![endif]-->  
          <a href="${generatedURL}" target="_blank" class="v-button" style="box-sizing: border-box;display: inline-block;font-family:arial,helvetica,sans-serif;text-decoration: none;-webkit-text-size-adjust: none;text-align: center;color: #FFFFFF; background-color: #33428d; border-radius: 44px;-webkit-border-radius: 44px; -moz-border-radius: 44px; width:auto; max-width:100%; overflow-wrap: break-word; word-break: break-word; word-wrap:break-word; mso-border-alt: none;font-size: 14px;">
            <span style="display:block;padding:20px 70px;line-height:120%;"><strong><span style="line-height: 16.8px;">VERIFY NOW</span></strong></span>
          </a>
        <!--[if mso]></center></v:roundrect><![endif]-->
      </div>
      
            </td>
          </tr>
        </tbody>
      </table>
      
      <table id="u_content_text_3" style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
          <tr>
            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 55px 40px;font-family:arial,helvetica,sans-serif;" align="left">
              
        <div style="line-height: 170%; text-align: left; word-wrap: break-word;">
          <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 16px; line-height: 27.2px;">If you didn’t sign up for Centalki, you can ignore this email. </span></p>
      <p style="font-size: 14px; line-height: 170%;"> </p>
      <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 16px; line-height: 27.2px;">Best regards,</span></p>
      <p style="font-size: 14px; line-height: 170%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 23.8px;"><strong><span style="font-size: 16px; line-height: 27.2px;">Centalki team</span></strong></span></p>
        </div>
      
            </td>
          </tr>
        </tbody>
      </table>
      
        <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
        </div>
      </div>
      <!--[if (mso)|(IE)]></td><![endif]-->
            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      
      
      
      <div class="u-row-container" style="padding: 0px;background-color: transparent">
        <div class="u-row" style="Margin: 0 auto;min-width: 320px;max-width: 600px;overflow-wrap: break-word;word-wrap: break-word;word-break: break-word;background-color: #080f30;">
          <div style="border-collapse: collapse;display: table;width: 100%;height: 100%;background-color: transparent;">
            <!--[if (mso)|(IE)]><table width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td style="padding: 0px;background-color: transparent;" align="center"><table cellpadding="0" cellspacing="0" border="0" style="width:600px;"><tr style="background-color: #080f30;"><![endif]-->
            
      <!--[if (mso)|(IE)]><td align="center" width="600" style="width: 600px;padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;" valign="top"><![endif]-->
      <div class="u-col u-col-100" style="max-width: 320px;min-width: 600px;display: table-cell;vertical-align: top;">
        <div style="height: 100%;width: 100% !important;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;">
        <!--[if (!mso)&(!IE)]><!--><div style="box-sizing: border-box; height: 100%; padding: 0px;border-top: 0px solid transparent;border-left: 0px solid transparent;border-right: 0px solid transparent;border-bottom: 0px solid transparent;border-radius: 0px;-webkit-border-radius: 0px; -moz-border-radius: 0px;"><!--<![endif]-->
      
      <table style="font-family:arial,helvetica,sans-serif;" role="presentation" cellpadding="0" cellspacing="0" width="100%" border="0">
        <tbody>
          <tr>
            <td class="v-container-padding-padding" style="overflow-wrap:break-word;word-break:break-word;padding:10px 10px 35px;font-family:arial,helvetica,sans-serif;" align="left">
              
        <div style="color: #ffffff; line-height: 210%; text-align: center; word-wrap: break-word;">
          <p style="font-size: 14px; line-height: 210%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">You're receiving this email because you signed up for Centalki.</span></p>
      <p style="font-size: 14px; line-height: 210%;"><span style="font-family: Lato, sans-serif; font-size: 14px; line-height: 29.4px;">©2023 Centalki | Ho Chi Minh City, Vietnam</span></p>
        </div>
      
            </td>
          </tr>
        </tbody>
      </table>
      
        <!--[if (!mso)&(!IE)]><!--></div><!--<![endif]-->
        </div>
      </div>
      <!--[if (mso)|(IE)]></td><![endif]-->
            <!--[if (mso)|(IE)]></tr></table></td></tr></table><![endif]-->
          </div>
        </div>
      </div>
      
      
          <!--[if (mso)|(IE)]></td></tr></table><![endif]-->
          </td>
        </tr>
        </tbody>
        </table>
        <!--[if mso]></div><![endif]-->
        <!--[if IE]></div><![endif]-->
      </body>
      
      </html>`,
    });
    return { success: true };
  }
}
