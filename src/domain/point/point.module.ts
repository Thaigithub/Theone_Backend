import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { PointMemberController } from './member/point-member.controller';
import { PointMemberService } from './member/point-member.service';
import { PointAdminController } from './admin/point-admin.controller';
import { PointAdminService } from './admin/point-admin.service';
import { NotificationModule } from 'domain/notification/notification.module';

@Module({
    imports: [PrismaModule, NotificationModule],
    controllers: [PointAdminController, PointMemberController],
    providers: [PointAdminService, PointMemberService],
    exports: [],
})
export class PointModule {}
