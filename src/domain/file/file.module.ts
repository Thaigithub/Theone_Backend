import { Module } from '@nestjs/common';
import { StorageService } from 'services/storage/storage.service';
import { FileAdminController } from './admin/file-admin.controller';
import { FileCompanyController } from './company/file-company.controller';
import { FileMemberController } from './member/file-member.controller';
import { FileUserController } from './user/file-user.controller';

@Module({
    controllers: [FileAdminController, FileCompanyController, FileMemberController, FileUserController],
    providers: [StorageService],
    exports: [StorageService],
})
export class FileModule {}
