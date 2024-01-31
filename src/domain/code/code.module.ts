import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CodeAdminController } from './admin/code-admin.controller';
import { CodeAdminService } from './admin/code-admin.service';
import { CodeCompanyController } from './company/code-company.controller';
import { CodeCompanyService } from './company/code-company.service';
import { CodeGuestController } from './guest/code-guest.controller';
import { CodeMemberController } from './member/code-member.controller';
import { CodeMemberService } from './member/code-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [CodeAdminController, CodeCompanyController, CodeMemberController, CodeGuestController],
    providers: [CodeAdminService, CodeCompanyService, CodeMemberService],
})
export class CodeModule {}
