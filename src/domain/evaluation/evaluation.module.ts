import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { EvaluationAdminController } from './admin/evaluation-admin.controller';
import { EvaluationAdminService } from './admin/evaluation-admin.service';
import { EvaluationCompanyController } from './company/evaluation-company.controller';
import { EvaluationCompanyService } from './company/evaluation-company.service';
import { EvaluationMemberController } from './member/evaluation-member.controller';
import { EvaluationMemberService } from './member/evaluation-member.service';

@Module({
    imports: [PrismaModule],
    controllers: [EvaluationAdminController, EvaluationCompanyController, EvaluationMemberController],
    providers: [EvaluationAdminService, EvaluationCompanyService, EvaluationMemberService],
    exports: [EvaluationAdminService, EvaluationCompanyService, EvaluationMemberService],
})
export class EvaluationModule {}
