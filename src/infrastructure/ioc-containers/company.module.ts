import { Module } from '@nestjs/common';
import { AdminCompanyController } from 'presentation/controllers/admin/admin-company.controller';
import { CompanyUseCase } from 'application/use-cases/company.use-case';
import { CompanyUseCaseImpl } from '../use-cases/company.use-case.impl';
import { CompanyRepository } from 'domain/repositories/company.repository';
import { CompanyRepositoryImpl } from '../repositories/company.repository.impl';
import { PrismaModule } from './prisma.module';
import { ExcelService } from 'infrastructure/services/excel.service';
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
