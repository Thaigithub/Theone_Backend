import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { PostAdminController } from './admin/post-admin.controller';
import { PostAdminService } from './admin/post-admin.service';
import { PostCompanyController } from './company/post-company.controller';
import { PostCompanyService } from './company/post-company.service';
import { PostMemberController } from './member/post-member.controller';
import { PostMemberService } from './member/post-member.service';
import { PostUserController } from './nonmember/post-user.controller';
import { PostUserService } from './nonmember/post-user.service';

@Module({
    imports: [PrismaModule],
    controllers: [PostAdminController, PostCompanyController, PostMemberController, PostUserController],
    providers: [PostAdminService, PostCompanyService, PostMemberService, PostUserService],
    exports: [PostAdminService, PostCompanyService, PostMemberService, PostUserService],
})
export class PostModule {}
