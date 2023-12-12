import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { AdminBannerController } from './admin/banner-admin.controller';
import { AdminBannerService } from './admin/banner-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [AdminBannerController],
    providers: [AdminBannerService],
    exports: [AdminBannerService],
})
export class BannerModule {}
