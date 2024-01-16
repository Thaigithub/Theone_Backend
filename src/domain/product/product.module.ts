import { Module } from '@nestjs/common';
import { PortoneModule } from 'services/portone/portone.module';
import { PrismaModule } from 'services/prisma/prisma.module';
import { ProductAdminController } from './admin/product-admin.controller';
import { ProductAdminService } from './admin/product-admin.service';
import { ExcelModule } from 'services/excel/excel.module';
import { ProductCompanyController } from './company/product-company.controller';
import { ProductCompanyService } from './company/product-company.service';
import { ProductWebhookController } from './webhook/product-webhook.controller';
import { ProductWebhookService } from './webhook/product-webhook.service';

@Module({
    imports: [PrismaModule, PortoneModule, ExcelModule],
    controllers: [ProductAdminController, ProductCompanyController, ProductWebhookController],
    providers: [ProductAdminService, ProductCompanyService, ProductWebhookService],
    exports: [],
})
export class ProductModule {}
