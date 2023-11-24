import { Inject, Injectable } from '@nestjs/common';
import { FileUseCase } from 'application/use-cases/file.use-case';
import { FileRepository } from 'domain/repositories/file.repository';
import { StorageService } from 'application/services/storage.service';

@Injectable()
export class FileUseCaseImpl implements FileUseCase {
  constructor(
    @Inject(FileRepository) private readonly fileRepository: FileRepository,
    @Inject(StorageService) private readonly storageService: StorageService,
  ) {}
}
