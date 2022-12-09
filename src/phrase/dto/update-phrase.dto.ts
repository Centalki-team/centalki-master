import { PartialType } from '@nestjs/swagger';
import { CreatePhraseDto } from './create-phrase.dto';

export class UpdatePhraseDto extends PartialType(CreatePhraseDto) {}
