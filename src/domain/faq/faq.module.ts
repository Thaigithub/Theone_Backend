import { Module } from '@nestjs/common';
import { PrismaModule } from 'services/prisma/prisma.module';
import { FaqAdminController } from './admin/faq-admin.controller';
import { FaqAdminService } from './admin/faq-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [FaqAdminController],
    providers: [FaqAdminService],
})
export class FaqModule {}
