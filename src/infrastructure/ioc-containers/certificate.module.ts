import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { MemberCertificateController } from 'presentation/controllers/member/member-certificate.controller';
import { CertificateRepository } from 'domain/repositories/certificate.repository';
import { CertificateUseCase } from 'application/use-cases/certificate.use-case';
import { CertificateUseCaseImpl } from 'infrastructure/use-cases/certificate.use-case.impl';
import { CertificateRepositoryImpl } from 'infrastructure/repositories/certificate.repository.impl';
import { MemberModule } from './member.module';

@Module({
  imports: [PrismaModule, MemberModule],
  controllers: [MemberCertificateController],
  providers: [
    {
      provide: CertificateUseCase,
      useClass: CertificateUseCaseImpl,
    },
    {
      provide: CertificateRepository,
      useClass: CertificateRepositoryImpl,
    },
  ],
  exports: [CertificateUseCase],
})
export class CertificateModule {}
