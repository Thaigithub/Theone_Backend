import { Module } from '@nestjs/common';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaModule } from 'services/prisma/prisma.module';
import { AdminAdminController } from './admin/admin-admin.controller';
import { AdminAdminService } from './admin/admin-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [AdminAdminController],
    providers: [AdminAdminService, ExcelService],
})
export class AdminModule {}
