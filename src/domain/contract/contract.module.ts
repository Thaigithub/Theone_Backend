import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { ContractAdminController } from './admin/contract-admin.controller';
import { ContractAdminService } from './admin/contract-admin.service';
import { ContractCompanyController } from './company/contract-company.controller';
import { ContractCompanyService } from './company/contract-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [ContractAdminController, ContractCompanyController],
    providers: [ContractAdminService, ContractCompanyService],
    exports: [ContractAdminService, ContractCompanyService],
})
export class ContractModule {}
