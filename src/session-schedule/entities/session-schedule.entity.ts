import { Collection } from 'fireorm';

@Collection()
export class SessionSchedule {
  id!: string;

  studentId!: string;

  teacherId?: string;

  startAt: string;

  pickedUpAt?: string;

  status: string;

  createdAt!: string;
}
