import { Collection } from 'fireorm';
import { genId } from 'src/utils/helper';

@Collection()
export class Certificate {
  constructor() {
    this.id = genId();
    this.name = null;
    this.userId = null;
    this.photoURL = null;
    this.backPhotoURL = null;
    this.issuedDate = null;
    this.issuedDepartment = null;
  }
  id!: string;

  userId!: string;

  name: string | null;

  photoURL: string | null;

  backPhotoURL: string | null;

  issuedDate: string | null;

  issuedDepartment: string | null;
}
