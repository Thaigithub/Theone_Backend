import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CurrencyExchangeAdminController } from './admin/currency-exchange-admin.controller';
import { CurrencyExchangeAdminService } from './admin/currency-exchange-admin.service';
import { NotificationModule } from 'domain/notification/notification.module';

@Module({
    imports: [PrismaModule, NotificationModule],
    controllers: [CurrencyExchangeAdminController],
    providers: [CurrencyExchangeAdminService],
    exports: [],
})
export class CurrencyExchangeModule {}
