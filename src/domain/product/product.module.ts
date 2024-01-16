import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { ProductCompanyController } from './company/product-company.controller';
import { ProductCompanyService } from './company/product-company.service';
import { ProductAdminController } from './admin/product-admin.controller';
import { ProductAdminService } from './admin/product-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [ProductAdminController, ProductCompanyController],
    providers: [ProductAdminService, ProductCompanyService],
    exports: [],
})
export class ProductModule {}
