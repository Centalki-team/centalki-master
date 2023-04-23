import { Collection } from 'fireorm';

@Collection()
export class SessionTeacherFeedback {
  id!: string;

  sessionId!: string;
  pronunciation: number;
  vocabularies: number;
  grammar: number;
  idea: number;
  fluency: number;
  description?: string;
  suggest?: string;
}
