import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { NotificationCompanyController } from './company/notification-company.controller';
import { NotificationCompanyService } from './company/notification-company.service';
import { NotificationMemberController } from './member/notification-member.controller';
import { NotificationMemberService } from './member/notification-member.service';
import { FireBaseModule } from 'services/firebase/firebase.module';

@Module({
    imports: [PrismaModule, FireBaseModule],
    controllers: [NotificationCompanyController, NotificationMemberController],
    providers: [NotificationCompanyService, NotificationMemberService],
    exports: [NotificationMemberService, NotificationCompanyService],
})
export class NotificationModule {}
