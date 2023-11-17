import { Module } from '@nestjs/common';
import { UserUseCase } from '../../application/use-cases/user.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { UserController } from '../../presentation/controllers/user.controller';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';
import { UserUseCaseImpl } from '../use-cases/user.use-case.impl';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [
    {
      provide: UserUseCase,
      useClass: UserUseCaseImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [UserUseCase],
})
export class UserModule {}
