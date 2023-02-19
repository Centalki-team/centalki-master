import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { BaseFirestoreRepository } from 'fireorm';
import { InjectRepository } from 'nestjs-fireorm';
import { AuthService } from 'src/auth/auth.service';
import { CreateCertificateDto } from './dto/create-certificate.dto';
import { UpdateCertificateDto } from './dto/update-certificate.dto';
import { Certificate } from './entities/certificate.entity';

@Injectable()
export class CertificateService {
  constructor(
    @InjectRepository(Certificate)
    private certificateRepository: BaseFirestoreRepository<Certificate>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService,
  ) {}
  async create(dto: CreateCertificateDto) {
    await this.authService.findOrThrow(dto.userId);
    const certificate = {
      ...new Certificate(),
      ...dto,
    };
    return this.certificateRepository.create(certificate);
  }

  async findByUserId(userId: string) {
    return (
      (await this.certificateRepository
        .whereEqualTo('userId', userId)
        .find()) || []
    );
  }

  async findOne(id: string) {
    const certificate = await this.certificateRepository
      .findById(id)
      .catch(() => null);
    if (!certificate) {
      throw new NotFoundException('Certificate not found!');
    }
    return certificate;
  }

  async update(id: string, updateCertificateDto: UpdateCertificateDto) {
    let certificate = await this.certificateRepository
      .findById(id)
      .catch(() => null);
    if (!certificate) {
      throw new NotFoundException('Certificate not found!');
    }
    certificate = {
      ...certificate,
      ...updateCertificateDto,
    };
    return await this.certificateRepository.update(certificate);
  }

  remove(id: string) {
    return this.certificateRepository.delete(id).catch(() => null);
  }
}
