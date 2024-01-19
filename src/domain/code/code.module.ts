import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CodeAdminController } from './admin/code-admin.controller';
import { CodeAdminService } from './admin/code-admin.service';
import { CodeCompanyController } from './company/code-company.controller';
import { CodeCompanyService } from './company/code-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [CodeAdminController, CodeCompanyController],
    providers: [CodeAdminService, CodeCompanyService],
})
export class CodeModule {}
