import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { PostAdminController } from './admin/post-admin.controller';
import { PostAdminService } from './admin/post-admin.service';
import { PostCompanyController } from './company/post-company.controller';
import { PostCompanyService } from './company/post-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [PostAdminController, PostCompanyController],
    providers: [PostAdminService, PostCompanyService],
    exports: [PostAdminService, PostCompanyService],
})
export class PostModule {}
