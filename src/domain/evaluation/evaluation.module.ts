import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { EvaluationAdminController } from './admin/evaluation-admin.controller';
import { EvaluationAdminService } from './admin/evaluation-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [EvaluationAdminController],
    providers: [EvaluationAdminService],
    exports: [],
})
export class EvaluationModule {}
