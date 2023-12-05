import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { ExcelModule } from 'services/excel/excel.module';
import { MemberAdminService } from './admin/member-admin.service';
import { MemberAdminController } from './admin/member-admin.controller';
import { MemberMemberController } from './member/member-member.controller';
import { MemberMemberService } from './member/member-member.service';

@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [MemberAdminController, MemberMemberController],
    providers: [MemberAdminService, MemberMemberService],
    exports: [MemberMemberService],
})
export class MemberModule {}
