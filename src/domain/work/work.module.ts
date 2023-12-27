import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { WorkAdminController } from './admin/work-admin.controller';
import { WorkAdminService } from './admin/work-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [WorkAdminController],
    providers: [WorkAdminService],
})
export class WorkModule {}
