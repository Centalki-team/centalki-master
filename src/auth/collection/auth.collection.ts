import { ERole } from '../enum/role.enum';
import { Collection } from 'fireorm';

@Collection()
export class AuthCollection {
  id!: string;

  role: ERole;

  uid: string;
}
