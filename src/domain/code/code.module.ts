import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CodeAdminController } from './admin/code-admin.controller';
import { CodeAdminService } from './admin/code-admin.service';
import { CodeCompanyController } from './company/code-company.controller';
import { CodeCompanyService } from './company/code-company.service';
import { CodeMemberService } from './member/code-member.service';
import { CodeMemberController } from './member/code-member.controller';

@Module({
    imports: [PrismaModule],
    controllers: [CodeAdminController, CodeCompanyController, CodeMemberController],
    providers: [CodeAdminService, CodeCompanyService, CodeMemberService],
})
export class CodeModule {}
