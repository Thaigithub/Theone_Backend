import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { NotificationModule } from 'domain/notification/notification.module';
import { PrismaModule } from 'services/prisma/prisma.module';
import { StorageService } from 'services/storage/storage.service';
import { CronJobService } from './cronjob.service';

@Module({
    imports: [PrismaModule, ScheduleModule.forRoot(), NotificationModule],
    providers: [CronJobService, StorageService],
})
export class CrobJobModule {}
