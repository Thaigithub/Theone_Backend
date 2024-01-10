import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { ProductAdminController } from './admin/product-admin.controller';
import { ProductAdminService } from './admin/product-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [ProductAdminController],
    providers: [ProductAdminService],
    exports: [],
})
export class ProductModule {}
