import { Injectable } from '@nestjs/common';
import { File } from 'domain/file/file.entity';
import { FileRepository } from 'domain/file/file.repository';
import { BaseRepositoryImpl } from '../../helpers/entity/base.repository.impl';
import { PrismaModel } from '../../helpers/entity/prisma.model';
import { PrismaService } from '../../helpers/entity/prisma.service';

@Injectable()
export class FileRepositoryImpl extends BaseRepositoryImpl<File> implements FileRepository {
    constructor(private readonly prismaService: PrismaService) {
        super(prismaService, PrismaModel.FILE);
    }
}
