import { Module } from '@nestjs/common';
import { AccountUseCase } from '../../application/use-cases/account.use-case';
import { AccountRepository } from '../../domain/repositories/account.repository';
import { AccountController } from '../../presentation/controllers/account.controller';
import { AccountRepositoryImpl } from '../repositories/user.repository.impl';
import { AccountUseCaseImpl } from '../use-cases/account.use-case.impl';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AccountController],
  providers: [
    {
      provide: AccountUseCase,
      useClass: AccountUseCaseImpl,
    },
    {
      provide: AccountRepository,
      useClass: AccountRepositoryImpl,
    },
  ],
  exports: [AccountUseCase, AccountRepository],
})
export class AccountModule {}
