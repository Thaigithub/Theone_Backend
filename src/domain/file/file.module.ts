import { Module } from '@nestjs/common';
import { FileController } from 'domain/file/file.controller';
import { FileRepository } from 'domain/file/file.repository';
import { FileRepositoryImpl } from 'domain/file/file.repository.impl';
import { FileUseCase } from 'domain/file/file.usecase';
import { FileUseCaseImpl } from 'domain/file/file.usecase.impl';
import { StorageService } from 'services/storage/storage.service';
import { StorageServiceImpl } from 'services/storage/storage.service.impl';
import { PrismaModule } from '../../helpers/entity/prisma.module';

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
