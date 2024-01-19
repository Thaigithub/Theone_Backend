import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { ApplicationAdminController } from './admin/application-admin.controller';
import { ApplicationAdminService } from './admin/application-admin.service';
import { ApplicationCompanyController } from './company/application-company.controller';
import { ApplicationCompanyService } from './company/application-company.service';
import { ApplicationMemberController } from './member/application-member.controller';
import { ApplicationMemberService } from './member/application-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [ApplicationAdminController, ApplicationCompanyController, ApplicationMemberController],
    providers: [ApplicationAdminService, ApplicationCompanyService, ApplicationMemberService],
    exports: [ApplicationAdminService, ApplicationCompanyService, ApplicationMemberService],
})
export class ApplicationModule {}
