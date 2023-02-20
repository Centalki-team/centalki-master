import { Collection, ISubCollection, SubCollection } from 'fireorm';
import { Topic } from 'src/topic/entities/topic.entity';
import { UserRecord } from 'firebase-admin/auth';

export class EventTracking {
  id: string;
  sessionId: string;
  timestamp: string;
  name: string;
}

@Collection()
export class SessionSchedule {
  id!: string;

  studentId!: string;
  student: UserRecord;

  topic: Topic;

  teacherId?: string;
  teacher?: UserRecord;

  startAt: string;

  endedAt?: string;

  joinedAt?: string;

  pickedUpAt?: string;

  status: string;

  @SubCollection(EventTracking)
  eventTrackings?: ISubCollection<EventTracking>;

  cost: number;

  createdAt!: string;
}
