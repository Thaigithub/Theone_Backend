import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { AdminAdminController } from './admin/admin-admin.controller';
import { AdminAdminService } from './admin/admin-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [AdminAdminController],
    providers: [AdminAdminService],
})
export class AdminModule {}
