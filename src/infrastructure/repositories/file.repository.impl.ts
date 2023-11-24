import { Injectable } from '@nestjs/common';
import { PrismaModel } from '../../domain/entities/prisma.model';
import { PrismaService } from '../services/prisma.service';
import { BaseRepositoryImpl } from './base.repository.impl';
import { FileRepository } from 'domain/repositories/file.repository';
import { File } from 'domain/entities/file.entity';

@Injectable()
export class FileRepositoryImpl extends BaseRepositoryImpl<File> implements FileRepository {
  constructor(private readonly prismaService: PrismaService) {
    super(prismaService, PrismaModel.FILE);
  }
}
