import { Module } from '@nestjs/common';
import { CertificateRepository } from 'domain/certification/certificate.repository';
import { CertificateRepositoryImpl } from 'domain/certification/certificate.repository.impl';
import { CertificateUseCase } from 'domain/certification/certificate.use-case';
import { CertificateUseCaseImpl } from 'domain/certification/certificate.use-case.impl';
import { MemberCertificateController } from 'domain/certification/member-certificate.controller';
import { PrismaModule } from '../../helpers/entity/prisma.module';
import { MemberModule } from '../member/member.module';

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
