import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { LaborCompanyController } from './company/labor-company.controller';
import { LaborCompanyService } from './company/labor-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [LaborCompanyController],
    providers: [LaborCompanyService],
})
export class InterviewModule {}
