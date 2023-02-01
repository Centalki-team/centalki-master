import { Collection } from 'fireorm';
// import { Topic } from 'src/topic/entities/topic.entity';

@Collection()
export class SessionSchedule {
  id!: string;

  studentId!: string;

  // @SubCollection(Topic)
  // topic: string;

  teacherId?: string;

  startAt: string;

  pickedUpAt?: string;

  status: string;

  createdAt!: string;
}
