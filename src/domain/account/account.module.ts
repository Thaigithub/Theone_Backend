import { Module } from '@nestjs/common';
import { AccountController } from 'domain/account/account.controller';
import { AccountRepository } from 'domain/account/account.repository';
import { AccountUseCase } from 'domain/account/account.use-case';
import { PrismaModule } from '../../helpers/entity/prisma.module';
import { AccountRepositoryImpl } from './account.repository.impl';
import { AccountUseCaseImpl } from './account.use-case.impl';

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
