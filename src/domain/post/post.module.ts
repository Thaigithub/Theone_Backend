import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { PostAdminController } from './admin/post-admin.controller';
import { PostAdminService } from './admin/post-admin.service';
import { PostCompanyController } from './company/post-company.controller';
import { PostCompanyService } from './company/post-company.service';
import { PostMemberController } from './member/post-member.controller';
import { PostMemberService } from './member/post-member.service';
import { TeamModule } from 'domain/team/team.module';
import { RegionModule } from 'domain/region/region.module';
import { PostGuestController } from './guest/post-guest.controller';
import { ProductModule } from 'domain/product/product.module';
import { StorageService } from 'services/storage/storage.service';

@Module({
    imports: [PrismaModule, TeamModule, RegionModule, ProductModule],
    controllers: [PostAdminController, PostCompanyController, PostMemberController, PostGuestController],
    providers: [PostAdminService, PostCompanyService, PostMemberService, StorageService],
    exports: [PostAdminService, PostCompanyService, PostMemberService],
})
export class PostModule {}
