import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { HeadhuntingAdminController } from './admin/headhunting-admin.controller';
import { HeadhuntingAdminService } from './admin/headhunting-admin.service';
import { HeadhuntingCompanyController } from './company/headhunting-company.controller';
import { HeadhuntingCompanyService } from './company/headhunting-company.service';

@Module({
    imports: [PrismaModule],
    controllers: [HeadhuntingAdminController, HeadhuntingCompanyController],
    providers: [HeadhuntingAdminService, HeadhuntingCompanyService],
})
export class HeadhuntingModule {}
