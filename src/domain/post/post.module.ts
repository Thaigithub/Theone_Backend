import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { PostAdminController } from './admin/post-admin.controller';
import { PostAdminService } from './admin/post-admin.service';
import { PostCompanyController } from './company/post-company.controller';
import { PostCompanyService } from './company/post-company.service';
import { PostMemberController } from './member/post-member.controller';
import { PostMemberService } from './member/post-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [PostAdminController, PostCompanyController, PostMemberController],
    providers: [PostAdminService, PostCompanyService, PostMemberService],
    exports: [PostAdminService, PostCompanyService, PostMemberService],
})
export class PostModule {}
