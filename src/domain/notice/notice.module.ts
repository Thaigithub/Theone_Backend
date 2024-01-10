import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { NoticeCompanyController } from './company/notice-company.controller';
import { NoticeCompanyService } from './company/notice-company.service';
import { NoticeMemberController } from './member/notice-member.controller';
import { NoticeMemberService } from './member/notice-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [NoticeCompanyController, NoticeMemberController],
    providers: [NoticeCompanyService, NoticeMemberService],
})
export class NoticeModule {}
