import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CertificateService } from './certificate.service';
import { MemberCertificateController } from './member/member-certificate.controller';

@Module({
    imports: [PrismaModule],
    controllers: [MemberCertificateController],
    providers: [CertificateService],
    exports: [CertificateService],
})
export class CertificateModule {}
