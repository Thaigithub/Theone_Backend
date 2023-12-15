import { Module } from '@nestjs/common';
import { ExcelModule } from 'services/excel/excel.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { MemberAdminController } from './admin/member-admin.controller';
import { MemberAdminService } from './admin/member-admin.service';
import { MemberCompanyController } from './company/member-company.controller';
import { MemberCompanyService } from './company/member-company.service';
import { MemberMemberController } from './member/member-member.controller';
import { MemberMemberService } from './member/member-member.service';

@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [MemberAdminController, MemberMemberController, MemberCompanyController],
    providers: [MemberAdminService, MemberMemberService, MemberCompanyService],
    exports: [MemberMemberService, MemberCompanyService],
})
export class MemberModule {}
