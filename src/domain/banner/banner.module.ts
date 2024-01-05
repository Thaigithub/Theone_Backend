import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { BannerAdminController } from './admin/banner-admin.controller';
import { BannerAdminService } from './admin/banner-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [BannerAdminController],
    providers: [BannerAdminService],
})
export class BannerModule {}
