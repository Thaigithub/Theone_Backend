import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { BannerAdminController } from './admin/banner-admin.controller';
import { BannerAdminService } from './admin/banner-admin.service';
import { BannerCompanyController } from './company/banner-company.controller';
import { BannerCompanyService } from './company/banner-company.service';
import { BannerMemberController } from './member/banner-member.controller';
import { BannerMemberService } from './member/banner-member.service';
import { BannerGuestController } from './guest/banner-guest.controller';

@Module({
    imports: [PrismaModule],
    controllers: [BannerAdminController, BannerCompanyController, BannerMemberController, BannerGuestController],
    providers: [BannerAdminService, BannerCompanyService, BannerMemberService],
})
export class BannerModule {}
