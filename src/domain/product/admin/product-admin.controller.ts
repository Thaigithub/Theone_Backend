import { Body, Controller, Get, Param, ParseIntPipe, Patch, Put, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType, UsageType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { GetListType } from './enum/product-admin-get-list.enum';
import { ProductAdminService } from './product-admin.service';
import { ProductAdminGetListRefundRequest } from './request/product-admin-get-list-refund.request';
import { ProductAdminUpdateFixedTermRequest } from './request/product-admin-update-fixed-term.request';
import { ProductAdminUpdateLimitedCountRequest } from './request/product-admin-update-limited-count.request';
import { ProductAdminUpdateRefundStatusRequest } from './request/product-admin-update-refund-status.request';
import { ProductAdminUpdateUsageCycleRequest } from './request/product-admin-update-usage-cycle.request';
import { ProductAdminGetDetailRefundResponse } from './response/product-admin-get-detail-refund.response';
import { ProductAdminGetListFixedTermResponse } from './response/product-admin-get-list-fixed-term.response';
import { ProductAdminGetListLimitedCountResponse } from './response/product-admin-get-list-limited-count.response';
import { ProductAdminGetListRefundResponse } from './response/product-admin-get-list-refund.response';
import { ProductAdminGetListUsageCycleResponse } from './response/product-admin-get-list-usage-cycle.response';
import { ProductAdminGetCompanyDetailLimitedCountResponse } from './response/product-admin-get-company-detail-limited-count.response';
import { ProductAdminGetCompanyDetailFixedTermResponse } from './response/product-admin-get-company-detail-fixed-term.response';
import { ProductAdminGetListSettlementRequest } from './request/product-admin-get-list-settlement.request';
import { ProductAdminGetListSettlementResponse } from './response/product-admin-get-list-settlement.response';
import { Response } from 'express';
import { ProductAdminDownloadSettlementRequest } from './request/product-admin-download-settlement.request';

@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Controller('admin/products')
export class ProductAdminController {
    constructor(private readonly productAdminService: ProductAdminService) {}

    @Get('/limited-count')
    async getListLimitedCount(): Promise<BaseResponse<ProductAdminGetListLimitedCountResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getList(GetListType.LIMITED_COUNT)) as ProductAdminGetListLimitedCountResponse,
        );
    }

    @Get('/fixed-term')
    async getListFixedTerm(): Promise<BaseResponse<ProductAdminGetListFixedTermResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getList(GetListType.FIXED_TERM)) as ProductAdminGetListFixedTermResponse,
        );
    }

    @Get('/usage-cycle')
    async getListUsageCycle(): Promise<BaseResponse<ProductAdminGetListUsageCycleResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getList(GetListType.USAGE_CYCLE)) as ProductAdminGetListUsageCycleResponse,
        );
    }

    @Get('/company/:id/limited-count')
    async getCompanyLimitedCountProductHistory(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ProductAdminGetCompanyDetailLimitedCountResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getCompanyProductHistory(
                id,
                UsageType.LIMITED_COUNT,
            )) as ProductAdminGetCompanyDetailLimitedCountResponse,
        );
    }

    @Get('/company/:id/fixed-term')
    async getCompanyFixedTermProductHistory(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ProductAdminGetCompanyDetailFixedTermResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getCompanyProductHistory(
                id,
                UsageType.FIX_TERM,
            )) as ProductAdminGetCompanyDetailFixedTermResponse,
        );
    }

    @Put('/limited-count')
    async updateProductsLimitedCount(@Body() body: ProductAdminUpdateLimitedCountRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.productAdminService.updateProductsLimitedCount(body));
    }

    @Put('/fixed-term')
    async updateProductsFixedTerm(@Body() body: ProductAdminUpdateFixedTermRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.productAdminService.updateProductsFixedTerm(body));
    }

    @Put('/usage-cycle')
    async updateUsageCycle(@Body() body: ProductAdminUpdateUsageCycleRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.productAdminService.updateUsageCycle(body));
    }

    @Get('/refund')
    async getListRefund(
        @Query() query: ProductAdminGetListRefundRequest,
    ): Promise<BaseResponse<ProductAdminGetListRefundResponse>> {
        return BaseResponse.of(await this.productAdminService.getListRefund(query));
    }

    @Get('/refund/:id')
    async getDetailRefund(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<ProductAdminGetDetailRefundResponse>> {
        return BaseResponse.of(await this.productAdminService.getDetailRefund(id));
    }

    @Patch('/refund/:id/status')
    async updateRefundStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ProductAdminUpdateRefundStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.productAdminService.updateRefundStatus(id, body));
    }

    @Get('settlement')
    async getListSettlement(
        @Query() query: ProductAdminGetListSettlementRequest,
    ): Promise<BaseResponse<ProductAdminGetListSettlementResponse>> {
        return BaseResponse.of(await this.productAdminService.getListSettlement(query));
    }

    @Get('settlement/download')
    async downloadSettlement(
        @Query() query: ProductAdminDownloadSettlementRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        const parsedIdList = query.idList.split(',').map((item) => parseInt(item));
        await this.productAdminService.downloadSettlement(parsedIdList, response);
        return BaseResponse.ok();
    }
}
