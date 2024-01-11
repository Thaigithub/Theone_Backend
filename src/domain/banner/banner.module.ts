import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { BannerAdminController } from './admin/banner-admin.controller';
import { BannerAdminService } from './admin/banner-admin.service';
import { BannerCompanyController } from './company/banner-company.controller';
import { BannerCompanyService } from './company/banner-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [BannerAdminController, BannerCompanyController],
    providers: [BannerAdminService, BannerCompanyService],
})
export class BannerModule {}
