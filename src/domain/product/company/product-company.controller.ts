import { Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { FileResponse } from 'utils/generics/file.response';
import { ProductCompanyService } from './product-company.service';
import { ProductCompanyGetPaymentHistoryListRequest } from './request/product-company-payment-history-get-list-list.request';
import { ProductCompanyUsageHistoryGetListRequest } from './request/product-company-usage-history-get-list.request';
import { ProductCompanyPaymentHistoryGetListResponse } from './response/product-company-payment-history-get-list-response';
import { ProductCompanyUsageHistoryGetListResponse } from './response/product-company-usage-history-get-list.response';

@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Controller('company/products')
export class ProductCompanyController {
    constructor(private readonly productPaymentHistoryCompanyService: ProductCompanyService) {}

    @Get('/payment')
    async getPaymentHistoryList(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: ProductCompanyGetPaymentHistoryListRequest,
    ): Promise<BaseResponse<ProductCompanyPaymentHistoryGetListResponse>> {
        return BaseResponse.of(await this.productPaymentHistoryCompanyService.getPaymentHistoryList(req.user.accountId, query));
    }

    @Get('/usage')
    async getUsageHistory(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: ProductCompanyUsageHistoryGetListRequest,
    ): Promise<BaseResponse<ProductCompanyUsageHistoryGetListResponse>> {
        return BaseResponse.of(await this.productPaymentHistoryCompanyService.getUsageHistory(req.user.accountId, query));
    }

    @Post('/payment/:id/taxbill')
    async createTaxBill(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.productPaymentHistoryCompanyService.createTaxBillRequest(req.user.accountId, id));
    }

    @Get('/payment/:id/taxbill')
    async getTaxBill(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<FileResponse>> {
        return BaseResponse.of(await this.productPaymentHistoryCompanyService.getTaxBill(req.user.accountId, id));
    }

    @Get('/payment/:id/card-receipt')
    async getcardReceipt(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<FileResponse>> {
        return BaseResponse.of(await this.productPaymentHistoryCompanyService.getcardReceipt(req.user.accountId, id));
    }
}
