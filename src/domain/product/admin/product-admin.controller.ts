import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { GetListType } from './dto/product-admin-get-list-type.enum';
import { ProductAdminService } from './product-admin.service';
import { ProductAdminUpdateFixedTermRequest } from './request/product-admin-update-fixed-term.request';
import { ProductAdminUpdateLimitedCountRequest } from './request/product-admin-update-limited-count.request';
import { ProductAdminUpdatePayAndUsageRequest } from './request/product-admin-update-pay-and-usage.request';
import { ProductAdminGetListLimitedCountResponse } from './response/product-admin-get-list-limited-count.response';
import { ProductAdminGetListFixedTermResponse } from './response/product-admin-get-list-fixed-term.response';
import { ProductAdminGetListPayAndUsageResponse } from './response/product-admin-get-list-pay-and-usage.response';

@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Controller('admin/products')
export class ProductAdminController {
    constructor(private readonly productAdminService: ProductAdminService) {}

    @Get('limited-count')
    async getListLimitedCount(): Promise<BaseResponse<ProductAdminGetListLimitedCountResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getList(GetListType.LIMITED_COUNT)) as ProductAdminGetListLimitedCountResponse,
        );
    }

    @Get('fixed-term')
    async getListFixedTerm(): Promise<BaseResponse<ProductAdminGetListFixedTermResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getList(GetListType.FIXED_TERM)) as ProductAdminGetListFixedTermResponse,
        );
    }

    @Get('pay-and-usage')
    async getListByPayAndUsage(): Promise<BaseResponse<ProductAdminGetListPayAndUsageResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getList(GetListType.PAY_AND_USAGE)) as ProductAdminGetListPayAndUsageResponse,
        );
    }

    @Put('limited-count')
    async updateProductsLimitedCount(@Body() body: ProductAdminUpdateLimitedCountRequest): Promise<BaseResponse<void>> {
        await this.productAdminService.updateProductsLimitedCount(body);
        return BaseResponse.ok();
    }

    @Put('fixed-term')
    async updateProductsFixedTerm(@Body() body: ProductAdminUpdateFixedTermRequest): Promise<BaseResponse<void>> {
        await this.productAdminService.updateProductsFixedTerm(body);
        return BaseResponse.ok();
    }

    @Put('pay-and-usage')
    async updatePayAndUsage(@Body() body: ProductAdminUpdatePayAndUsageRequest): Promise<BaseResponse<void>> {
        await this.productAdminService.updatePayAndUsage(body);
        return BaseResponse.ok();
    }
}
