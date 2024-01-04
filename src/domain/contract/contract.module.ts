import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { ContractAdminController } from './admin/contract-admin.controller';
import { ContractAdminService } from './admin/contract-admin.service';
import { ContractCompanyController } from './company/contract-company.controller';
import { ContractCompanyService } from './company/contract-company.service';
import { ContractMemberController } from './member/contract-member.controller';
import { ContractMemberService } from './member/contract-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [ContractAdminController, ContractCompanyController, ContractMemberController],
    providers: [ContractAdminService, ContractCompanyService, ContractMemberService],
    exports: [ContractAdminService, ContractCompanyService],
})
export class ContractModule {}
