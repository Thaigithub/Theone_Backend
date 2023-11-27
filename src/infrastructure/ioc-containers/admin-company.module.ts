import { Module } from '@nestjs/common';
import { CompanyRepository } from 'domain/repositories/company.repository';
import { CompanyRepositoryImpl } from '../repositories/company.repository.impl';
import { PrismaModule } from './prisma.module';
import { AdminCompanyController } from 'presentation/controllers/admin-company.controller';
import { CompanyUseCase } from 'application/use-cases/company.use-case';
import { CompanyUseCaseImpl } from '../use-cases/company.use-case.impl';
@Module({
  imports: [PrismaModule],
  controllers: [AdminCompanyController],
  providers: [
    {
      provide: CompanyRepository,
      useClass: CompanyRepositoryImpl,
    },
    {
      provide: CompanyUseCase,
      useClass: CompanyUseCaseImpl
    }
  ],
  exports: [CompanyRepository, CompanyUseCase],
})
export class AdminCompanyModule {}
