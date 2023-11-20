import { Module } from '@nestjs/common';
import { AuthUseCase } from '../../application/use-cases/auth.use-case';
import { UserRepository } from '../../domain/repositories/user.repository';
import { AuthController } from '../../presentation/controllers/auth.controller';
import { UserRepositoryImpl } from '../repositories/user.repository.impl';
import { AuthUseCaseImpl } from '../use-cases/auth.use-case.impl';
import { PrismaModule } from './prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthUseCase,
      useClass: AuthUseCaseImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryImpl,
    },
  ],
  exports: [AuthUseCase],
})
export class UserModule {}
