import { Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { FileResponse } from 'utils/generics/file.response';
import { GetListType } from '../admin/enum/product-admin-get-list.enum';
import { ProductAdminService } from '../admin/product-admin.service';
import { ProductCompanyService } from './product-company.service';
import { ProductCompanyGetListFixedTermResponse } from './request/product-company-get-list-fixed-term.response';
import { ProductCompanyGetListLimitedCountResponse } from './request/product-company-get-list-limited-count.response';
import { ProductCompanyGetPaymentHistoryListRequest } from './request/product-company-payment-history-get-list-list.request';
import { ProductCompanyUsageHistoryGetListRequest } from './request/product-company-usage-history-get-list.request';
import { ProductCompanyPaymentCreateResponse } from './response/product-company-payment-create.response';
import { ProductCompanyPaymentHistoryGetListResponse } from './response/product-company-payment-history-get-list-response';
import { ProductCompanyUsageHistoryGetListResponse } from './response/product-company-usage-history-get-list.response';
import { ProductCompanyCheckPremiumAvailabilityResponse } from './response/product-company-check-premium-availability.response';

@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Controller('company/products')
export class ProductCompanyController {
    constructor(
        private readonly productCompanyService: ProductCompanyService,
        private readonly productAdminService: ProductAdminService,
    ) {}

    @Get('/payment')
    async getPaymentHistoryList(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: ProductCompanyGetPaymentHistoryListRequest,
    ): Promise<BaseResponse<ProductCompanyPaymentHistoryGetListResponse>> {
        return BaseResponse.of(await this.productCompanyService.getPaymentHistoryList(req.user.accountId, query));
    }

    @Get('/usage')
    async getUsageHistory(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: ProductCompanyUsageHistoryGetListRequest,
    ): Promise<BaseResponse<ProductCompanyUsageHistoryGetListResponse>> {
        return BaseResponse.of(await this.productCompanyService.getUsageHistory(req.user.accountId, query));
    }

    @Post('/:id/payment')
    async create(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AccountIdExtensionRequest,
    ): Promise<BaseResponse<ProductCompanyPaymentCreateResponse>> {
        return BaseResponse.of(await this.productCompanyService.createPaymentHistory(id, req.user.accountId));
    }

    @Post('/payment/:id/refund')
    async createRefund(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.productCompanyService.createRefund(req.user.accountId, id));
    }

    @Post('/payment/:id/taxbill')
    async createTaxBill(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.productCompanyService.createTaxBillRequest(req.user.accountId, id));
    }

    @Get('/payment/:id/taxbill')
    async getTaxBill(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<FileResponse>> {
        return BaseResponse.of(await this.productCompanyService.getTaxBill(req.user.accountId, id));
    }

    @Get('/payment/:id/card-receipt')
    async getcardReceipt(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<FileResponse>> {
        return BaseResponse.of(await this.productCompanyService.getcardReceipt(req.user.accountId, id));
    }

    @Get('/limited-count')
    async getListLimitedCount(): Promise<BaseResponse<ProductCompanyGetListLimitedCountResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getList(GetListType.LIMITED_COUNT)) as ProductCompanyGetListLimitedCountResponse,
        );
    }

    @Get('/fixed-term')
    async getListFixedTerm(): Promise<BaseResponse<ProductCompanyGetListFixedTermResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getList(GetListType.FIXED_TERM)) as ProductCompanyGetListFixedTermResponse,
        );
    }

    @Get('/premium/availability')
    async checkPremiumAvailability(
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<ProductCompanyCheckPremiumAvailabilityResponse>> {
        return BaseResponse.of(await this.productCompanyService.checkPremiumAvailability(request.user.accountId));
    }
}
