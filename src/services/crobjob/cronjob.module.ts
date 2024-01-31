import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from 'services/prisma/prisma.module';
import { StorageService } from 'services/storage/storage.service';
import { CronJobService } from './cronjob.service';

@Module({
    imports: [PrismaModule, ScheduleModule.forRoot()],
    providers: [CronJobService, StorageService],
})
export class CrobJobModule {}
