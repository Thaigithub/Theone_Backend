import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { SiteCompanyController } from './company/site-company.controller';
import { SiteCompanyService } from './company/site-company.service';
@Module({
    imports: [PrismaModule],
    controllers: [SiteCompanyController],
    providers: [SiteCompanyService],
    exports: [],
})
export class SiteModule {}
