import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { PointMemberController } from './member/point-member.controller';
import { PointMemberService } from './member/point-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [PointMemberController],
    providers: [PointMemberService],
    exports: [],
})
export class PointModule {}
