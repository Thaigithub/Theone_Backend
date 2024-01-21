import { Module } from '@nestjs/common';
import { ExcelModule } from 'services/excel/excel.module';
import { PrismaModule } from 'services/prisma/prisma.module';
import { LaborAdminController } from './admin/labor-admin.controller';
import { LaborAdminService } from './admin/labor-admin.service';
import { LaborCompanyController } from './company/labor-company.controller';
import { LaborCompanyService } from './company/labor-company.service';
import { LaborMemberController } from './member/labor-member.controller';
import { LaborMemberService } from './member/labor-member.service';

@Module({
    imports: [PrismaModule, ExcelModule],
    controllers: [LaborCompanyController, LaborAdminController, LaborMemberController],
    providers: [LaborCompanyService, LaborAdminService, LaborMemberService],
})
export class LaborModule {}
