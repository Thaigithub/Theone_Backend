import { Module } from '@nestjs/common';
import { PostModule } from 'domain/post/post.module';
import { SiteModule } from 'domain/site/site.module';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { InterestMemberController } from './member/interest-member.controller';
import { InterestMemberService } from './member/interest-member.service';

@Module({
    imports: [PrismaModule, SiteModule, PostModule],
    controllers: [InterestMemberController],
    providers: [InterestMemberService],
    exports: [],
})
export class InterestModule {}
