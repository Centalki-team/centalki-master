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
  }
  id!: string;

  englishName?: string;

  dob?: string;

  gender?: EGender | null;

  uid: string;
}
