import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { NoticeCompanyController } from './company/notice-company.controller';
import { NoticeCompanyService } from './company/notice-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [NoticeCompanyController],
    providers: [NoticeCompanyService],
})
export class NoticeModule {}
