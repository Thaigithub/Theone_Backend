import { Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { FileResponse } from 'utils/generics/file.response';
import { GetListType } from '../admin/enum/product-admin-get-list.enum';
import { ProductAdminService } from '../admin/product-admin.service';
import { ProductCompanyService } from './product-company.service';
import { ProductCompanyCheckAvailabilityRequest } from './request/product-company-check-availability.request';
import { ProductCompanyGetListFixedTermResponse } from './request/product-company-get-list-fixed-term.response';
import { ProductCompanyGetListLimitedCountResponse } from './request/product-company-get-list-limited-count.response';
import { ProductCompanyGetPaymentHistoryListRequest } from './request/product-company-payment-history-get-list-list.request';
import { ProductCompanyUsageHistoryGetListRequest } from './request/product-company-usage-history-get-list.request';
import { ProductCompanyCheckAvailabilityResponse } from './response/product-company-check-availability.response';
import { ProductCompanyPaymentCreateResponse } from './response/product-company-payment-create.response';
import { ProductCompanyPaymentHistoryGetListResponse } from './response/product-company-payment-history-get-list-response';
import { ProductCompanyUsageHistoryGetListResponse } from './response/product-company-usage-history-get-list.response';

@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Controller('company/products')
export class ProductCompanyController {
    constructor(
        private productCompanyService: ProductCompanyService,
        private productAdminService: ProductAdminService,
    ) {}

    @Get('/payment')
    async getPaymentHistoryList(
        @Req() req: BaseRequest,
        @Query() query: ProductCompanyGetPaymentHistoryListRequest,
    ): Promise<BaseResponse<ProductCompanyPaymentHistoryGetListResponse>> {
        return BaseResponse.of(await this.productCompanyService.getPaymentHistoryList(req.user.accountId, query));
    }

    @Get('/usage')
    async getUsageHistory(
        @Req() req: BaseRequest,
        @Query() query: ProductCompanyUsageHistoryGetListRequest,
    ): Promise<BaseResponse<ProductCompanyUsageHistoryGetListResponse>> {
        return BaseResponse.of(await this.productCompanyService.getUsageHistory(req.user.accountId, query));
    }

    @Post('/:id/payment')
    async create(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ProductCompanyPaymentCreateResponse>> {
        return BaseResponse.of(await this.productCompanyService.createPaymentHistory(id, req.user.accountId));
    }

    @Post('/payment/:id/refund')
    async createRefund(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.productCompanyService.createRefund(req.user.accountId, id));
    }

    @Post('/payment/:id/taxbill')
    async createTaxBill(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.productCompanyService.createTaxBillRequest(req.user.accountId, id));
    }

    @Get('/payment/:id/taxbill')
    async getTaxBill(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<FileResponse>> {
        return BaseResponse.of(await this.productCompanyService.getTaxBill(req.user.accountId, id));
    }

    @Get('/payment/:id/card-receipt')
    async getcardReceipt(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<FileResponse>> {
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

    @Get('/availability')
    async checkAvailability(
        @Req() request: BaseRequest,
        @Query() query: ProductCompanyCheckAvailabilityRequest,
    ): Promise<BaseResponse<ProductCompanyCheckAvailabilityResponse>> {
        return BaseResponse.of(await this.productCompanyService.checkAvailability(request.user.accountId, query));
    }
}
