import { Body, Controller, Get, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { GetListType } from './dto/product-admin-get-list.enum';
import { ProductAdminService } from './product-admin.service';
import { ProductAdminUpdateFixedTermRequest } from './request/product-admin-update-fixed-term.request';
import { ProductAdminUpdateLimitedCountRequest } from './request/product-admin-update-limited-count.request';
import { ProductAdminUpdateUsageCycleRequest } from './request/product-admin-update-usage-cycle.request';
import { ProductAdminGetListFixedTermResponse } from './response/product-admin-get-list-fixed-term.response';
import { ProductAdminGetListLimitedCountResponse } from './response/product-admin-get-list-limited-count.response';
import { ProductAdminGetListUsageCycleResponse } from './response/product-admin-get-list-usage-cycle.response';
import { ProductAdminGetListCompanyRequest } from './request/product-admin-get-list-company.request';
import { ProductAdminGetListCompanyResponse } from './response/product-admin-get-list-company.response';

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

    @Get('usage-cycle')
    async getListUsageCycle(): Promise<BaseResponse<ProductAdminGetListUsageCycleResponse>> {
        return BaseResponse.of(
            (await this.productAdminService.getList(GetListType.USAGE_CYCLE)) as ProductAdminGetListUsageCycleResponse,
        );
    }

    @Get('companies')
    async getListCompany(
        @Query() query: ProductAdminGetListCompanyRequest,
    ): Promise<BaseResponse<ProductAdminGetListCompanyResponse>> {
        return BaseResponse.of(await this.productAdminService.getListCompany(query));
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

    @Put('usage-cycle')
    async updateUsageCycle(@Body() body: ProductAdminUpdateUsageCycleRequest): Promise<BaseResponse<void>> {
        await this.productAdminService.updateUsageCycle(body);
        return BaseResponse.ok();
    }
}
