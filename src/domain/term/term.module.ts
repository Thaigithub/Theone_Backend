import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { TermAdminController } from './admin/term-admin.controller';
import { TermAdminService } from './admin/term-admin.service';
import { TermMemberController } from './member/term-member.controller';
import { TermMemberService } from './member/term-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [TermAdminController, TermMemberController],
    providers: [TermAdminService, TermMemberService],
})
export class TermModule {}
