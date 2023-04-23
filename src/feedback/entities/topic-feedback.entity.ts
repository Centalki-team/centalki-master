import { Collection } from 'fireorm';

@Collection()
export class TopicFeedback {
  id!: string;
  userId!: string;
  topicId!: string;

  topicNameSummary?: string[];
  topicNameDetail?: string;

  topicPhotoSummary?: string[];
  topicPhotoDetail?: string;

  topicDescriptionSummary?: string[];
  topicDescriptionDetail?: string;

  topicVocabSummary?: string[];
  topicVocabDetail?: string;

  topicQuestionSummary?: string[];
  topicQuestionDetail?: string;
}
