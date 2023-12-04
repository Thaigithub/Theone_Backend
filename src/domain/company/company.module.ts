import { Module } from '@nestjs/common';
import { AdminCompanyController } from 'domain/company/admin-company.controller';
import { CompanyRepository } from 'domain/company/company.repository';
import { CompanyUseCase } from 'domain/company/company.use-case';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaModule } from '../../helpers/entity/prisma.module';
import { CompanyRepositoryImpl } from './company.repository.impl';
import { CompanyUseCaseImpl } from './company.use-case.impl';
@Module({
    imports: [PrismaModule],
    controllers: [AdminCompanyController],
    providers: [
        {
            provide: CompanyUseCase,
            useClass: CompanyUseCaseImpl,
        },
        {
            provide: CompanyRepository,
            useClass: CompanyRepositoryImpl,
        },
        ExcelService,
    ],
    exports: [CompanyRepository, CompanyUseCase],
})
export class CompanyModule {}
