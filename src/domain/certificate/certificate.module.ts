import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { MemberCertificateService } from './member/member-certificate.service';
import { MemberCertificateController } from './member/member-certificate.controller';

@Module({
    imports: [PrismaModule],
    controllers: [MemberCertificateController],
    providers: [MemberCertificateService],
})
export class CertificateModule {}
