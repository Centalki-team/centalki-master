import { Collection } from 'fireorm';

@Collection()
export class EventTracking {
  id: string;
  sessionId: string;
  timestamp: string;
  name: string;
}
