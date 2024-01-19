import { Module } from '@nestjs/common';
import { PrismaModule } from '../../services/prisma/prisma.module';
import { CurrencyExchangeAdminController } from './admin/currency-exchange-admin.controller';
import { CurrencyExchangeAdminService } from './admin/currency-exchange-admin.service';

@Module({
    imports: [PrismaModule],
    controllers: [CurrencyExchangeAdminController],
    providers: [CurrencyExchangeAdminService],
    exports: [],
})
export class CurrencyExchangeModule {}
