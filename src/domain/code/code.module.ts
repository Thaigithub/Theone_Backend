import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CodeAdminController } from './admin/code-admin.controller';
import { CodeAdminService } from './admin/code-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [CodeAdminController],
    providers: [CodeAdminService],
})
export class CodeModule {}
