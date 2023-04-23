import { Collection } from 'fireorm';

@Collection()
export class SessionStudentFeedback {
  id!: string;

  sessionId!: string;
  rating: number;
  description?: string;
  notSatisfiedDetail?: string;
  suggestForTeacher?: string;
  notSatisfiedWith?: string[];
  satisfiedWith?: string[];
}
