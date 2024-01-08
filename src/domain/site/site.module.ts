import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { SiteCompanyController } from './company/site-company.controller';
import { SiteCompanyService } from './company/site-company.service';
import { SiteMemberController } from './member/site-member.controller';
import { SiteMemberService } from './member/site-member.service';
@Module({
    imports: [PrismaModule],
    controllers: [SiteCompanyController, SiteMemberController],
    providers: [SiteCompanyService, SiteMemberService],
    exports: [SiteMemberService],
})
export class SiteModule {}
