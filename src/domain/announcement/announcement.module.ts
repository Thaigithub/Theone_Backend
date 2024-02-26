import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AnnouncementAdminController } from './admin/announcement-admin.controller';
import { AnnouncementAdminService } from './admin/announcement-admin.service';
import { AnnouncementCompanyController } from './company/announcement-company.controller';
import { AnnouncementCompanyService } from './company/announcement-company.service';
import { AnnouncementGuestService } from './guest/announcement-guest.service';
import { AnnouncementGuestController } from './guest/announcement-guest.controller';

@Module({
    imports: [PrismaModule],
    controllers: [AnnouncementAdminController, AnnouncementCompanyController, AnnouncementGuestController],
    providers: [AnnouncementAdminService, AnnouncementCompanyService, AnnouncementGuestService],
    exports: [],
})
export class AnnouncementModule {}
