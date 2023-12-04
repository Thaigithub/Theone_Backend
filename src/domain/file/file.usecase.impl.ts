import { Inject, Injectable } from '@nestjs/common';
import { FileRepository } from 'domain/file/file.repository';
import { FileUseCase } from 'domain/file/file.usecase';
import { StorageService } from 'services/storage/storage.service';

@Injectable()
export class FileUseCaseImpl implements FileUseCase {
    constructor(
        @Inject(FileRepository) private readonly fileRepository: FileRepository,
        @Inject(StorageService) private readonly storageService: StorageService,
    ) {}
}
