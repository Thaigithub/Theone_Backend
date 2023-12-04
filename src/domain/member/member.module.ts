import { Module } from '@nestjs/common';
import { AdminMemberController } from 'domain/member/admin-member.controller';
import { MemberMemberController } from 'domain/member/member-member.controller';
import { MemberRepository } from 'domain/member/member.repository';
import { MemberRepositoryImpl } from 'domain/member/member.repository.impl';
import { MemberUseCase } from 'domain/member/member.use-case';
import { MemberUseCaseImpl } from 'domain/member/member.use-case.impl';
import { ExcelService } from 'services/excel/excel.service';
import { PrismaModule } from '../../helpers/entity/prisma.module';

@Module({
    imports: [PrismaModule],
    controllers: [AdminMemberController, MemberMemberController],
    providers: [
        {
            provide: MemberUseCase,
            useClass: MemberUseCaseImpl,
        },
        {
            provide: MemberRepository,
            useClass: MemberRepositoryImpl,
        },
        ExcelService,
    ],
    exports: [MemberUseCase, MemberRepository],
})
export class MemberModule {}
