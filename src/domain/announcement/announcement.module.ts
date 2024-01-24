import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { AnnouncementAdminController } from './admin/announcement-admin.controller';
import { AnnouncementAdminService } from './admin/announcement-admin.service';
import { AnnouncementCompanyController } from './company/announcement-company.controller';
import { AnnouncementCompanyService } from './company/announcement-company.service';
import { AnnouncementMemberController } from "./member'/announcement-member.controller";
import { AnnouncementMemberService } from "./member'/announcement-member.service";

@Module({
    imports: [PrismaModule],
    controllers: [AnnouncementAdminController, AnnouncementCompanyController, AnnouncementMemberController],
    providers: [AnnouncementAdminService, AnnouncementCompanyService, AnnouncementMemberService],
    exports: [],
})
export class AnnouncementModule {}
