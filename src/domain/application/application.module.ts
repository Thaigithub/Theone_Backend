import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { ApplicationCompanyController } from './company/application-company.controller';
import { ApplicationCompanyService } from './company/application-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [ApplicationCompanyController],
    providers: [ApplicationCompanyService],
    exports: [ApplicationCompanyService],
})
export class ApplicationModule {}
