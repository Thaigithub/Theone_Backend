import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { ContractCompanyController } from './company/contract-company.controller';
import { ContractCompanyService } from './company/contract-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [ContractCompanyController],
    providers: [ContractCompanyService],
    exports: [],
})
export class ContractModule {}
