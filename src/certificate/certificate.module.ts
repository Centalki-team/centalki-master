import { forwardRef, Module } from '@nestjs/common';
import { CertificateService } from './certificate.service';
import { CertificateController } from './certificate.controller';
import { FireormModule } from 'nestjs-fireorm';
import { AuthModule } from 'src/auth/auth.module';
import { Certificate } from './entities/certificate.entity';

@Module({
  imports: [
    FireormModule.forFeature([Certificate]),
    forwardRef(() => AuthModule),
  ],
  controllers: [CertificateController],
  providers: [CertificateService],
  exports: [CertificateService],
})
export class CertificateModule {}
