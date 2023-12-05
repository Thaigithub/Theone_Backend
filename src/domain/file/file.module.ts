import { Module } from '@nestjs/common';
import { StorageService } from 'services/storage/storage.service';
import { StorageServiceImpl } from 'services/storage/storage.service.impl';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { FileAdminController } from './admin/file-admin.controller';
import { FileCompanyController } from './company/file-company.controller';
import { FileMemberController } from './member/file-member.controller';
import { FileUserController } from './user/file-user.controller';

@Module({
    imports: [PrismaModule],
    controllers: [FileAdminController, FileCompanyController, FileMemberController, FileUserController],
    providers: [
        {
            provide: StorageService,
            useClass: StorageServiceImpl,
        },
    ],
    exports: [StorageService],
})
export class FileModule {}
