import { Module } from '@nestjs/common';
import { MemberModule } from 'domain/member/member.module';
import { NotificationModule } from 'domain/notification/notification.module';
import { TeamModule } from 'domain/team/team.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { HeadhuntingAdminController } from './admin/headhunting-admin.controller';
import { HeadhuntingAdminService } from './admin/headhunting-admin.service';
import { HeadhuntingCompanyController } from './company/headhunting-company.controller';
import { HeadhuntingCompanyService } from './company/headhunting-company.service';

@Module({
    imports: [PrismaModule, NotificationModule, TeamModule, MemberModule],
    controllers: [HeadhuntingAdminController, HeadhuntingCompanyController],
    providers: [HeadhuntingAdminService, HeadhuntingCompanyService],
})
export class HeadhuntingModule {}
