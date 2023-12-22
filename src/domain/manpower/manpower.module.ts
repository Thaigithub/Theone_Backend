import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { ManpowerCompanyService } from './company/manpower-company.service';
import { ManpowerCompanyController } from './company/manpower-company.controller';

@Module({
    imports: [PrismaModule],
    controllers: [ManpowerCompanyController],
    providers: [ManpowerCompanyService],
    exports: [ManpowerCompanyService],
})
export class ManpowerModule {}
