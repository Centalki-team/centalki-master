import { Collection } from 'fireorm';
import { Topic } from 'src/topic/entities/topic.entity';
import { UserRecord } from 'firebase-admin/auth';

@Collection()
export class SessionSchedule {
  id!: string;

  studentId!: string;
  student: UserRecord;

  topic: Topic;

  teacherId?: string;
  teacher?: UserRecord;

  startAt: string;

  pickedUpAt?: string;

  status: string;

  createdAt!: string;
}
