import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { SiteCompanyController } from './company/site-company.controller';
import { SiteCompanyService } from './company/site-company.service';
import { SiteMemberController } from './member/site-member.controller';
import { SiteMemberService } from './member/site-member.service';
import { SiteGuestController } from './guest/site-guest.controller';
import { ExcelModule } from 'services/excel/excel.module';
import { SiteAdminController } from './admin/site-admin.controller';
import { SiteAdminService } from './admin/site-admin.service';
@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [SiteAdminController, SiteCompanyController, SiteMemberController, SiteGuestController],
    providers: [SiteAdminService, SiteCompanyService, SiteMemberService],
    exports: [SiteMemberService],
})
export class SiteModule {}
