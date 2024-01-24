import { Module } from '@nestjs/common';
import { CronJobService } from './cronjob.service';
import { PrismaModule } from 'services/prisma/prisma.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
    imports: [PrismaModule, ScheduleModule.forRoot()],
    providers: [CronJobService],
})
export class CrobJobModule {}
