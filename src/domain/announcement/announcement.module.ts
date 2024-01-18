import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AnnouncementAdminController } from './admin/announcement-admin.controller';
import { AnnouncementAdminService } from './admin/announcement-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [AnnouncementAdminController],
    providers: [AnnouncementAdminService],
    exports: [],
})
export class AnnouncementModule {}
