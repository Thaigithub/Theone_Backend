import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma.module';
import { FileController } from 'presentation/controllers/file.controller';
import { StorageService } from 'application/services/storage.service';
import { StorageServiceImpl } from 'infrastructure/services/storage.service.impl';
import { FileUseCase } from 'application/use-cases/file.use-case';
import { FileUseCaseImpl } from 'infrastructure/use-cases/file.use-case.impl';
import { FileRepository } from 'domain/repositories/file.repository';
import { FileRepositoryImpl } from 'infrastructure/repositories/file.repository.impl';

@Module({
  imports: [PrismaModule],
  controllers: [FileController],
  providers: [
    {
      provide: FileUseCase,
      useClass: FileUseCaseImpl,
    },
    {
      provide: FileRepository,
      useClass: FileRepositoryImpl,
    },
    {
      provide: StorageService,
      useClass: StorageServiceImpl,
    },
  ],
  exports: [StorageService, FileUseCase, FileRepository],
})
export class FileModule {}
