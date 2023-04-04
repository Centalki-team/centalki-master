import { Collection } from 'fireorm';
import { genId } from 'src/utils/helper';
import { EGender } from '../enum/gender.enum';

@Collection()
export class UserProfile {
  constructor() {
    this.id = genId();
    this.englishName = null;
    this.dob = null;
    this.gender = null;
    this.uid = null;
    this.balance = 0;
    this.costPerSession = 100_000;
    this.currency = 'vnd';
    this.bio = null;
    this.nationality = null;
    this.education = null;
    this.experience = null;
    this.speakingLevelIds = [];
    this.interestedTopicIds = [];
  }
  id!: string;

  englishName?: string;

  dob?: string;

  bio?: null | string;

  nationality: null | string;

  education: null | string;

  experience: null | string;

  speakingLevelIds: string[];

  interestedTopicIds: string[];

  gender?: EGender | null;

  uid: string;

  balance: number;

  currency: string;

  costPerSession: number;

  initialLevelId?: null | string;
}
