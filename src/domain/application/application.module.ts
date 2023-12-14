import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { ApplicationAdminController } from './admin/application-admin.controller';
import { ApplicationAdminService } from './admin/application-admin.service';
import { ApplicationCompanyController } from './company/application-company.controller';
import { ApplicationCompanyService } from './company/application-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [ApplicationAdminController, ApplicationCompanyController],
    providers: [ApplicationAdminService, ApplicationCompanyService],
    exports: [ApplicationAdminService, ApplicationCompanyService],
})
export class ApplicationModule {}
