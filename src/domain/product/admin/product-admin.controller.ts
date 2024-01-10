import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { GetListType } from './dto/product-admin-get-list-type.enum';
import { ProductAdminService } from './product-admin.service';
import { ProductAdminUpdatePayAndUsageRequest } from './request/product-admin-update-pay-and-usage.request';
import { ProductAdminUpdateByNumberRequest } from './request/product-admin-update-by-number.request';
import { ProductAdminUpdateByTermRequest } from './request/product-admin-update-by-term.request';

@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Controller('admin/products')
export class ProductAdminController {
    constructor(private readonly productAdminService: ProductAdminService) {}

    @Get('number')
    async getListByNumber(): Promise<BaseResponse<any>> {
        return BaseResponse.of(await this.productAdminService.getList(GetListType.BY_NUMBER));
    }

    @Get('term')
    async getListByTerm(): Promise<BaseResponse<any>> {
        return BaseResponse.of(await this.productAdminService.getList(GetListType.BY_TERM));
    }

    @Get('pay-and-usage')
    async getListByPayAndUsage(): Promise<BaseResponse<any>> {
        return BaseResponse.of(await this.productAdminService.getList(GetListType.BY_PAY_AND_USAGE));
    }

    @Put('number')
    async updateProductsByNumber(@Body() body: ProductAdminUpdateByNumberRequest): Promise<BaseResponse<void>> {
        await this.productAdminService.updateProductsByNumber(body);
        return BaseResponse.ok();
    }

    @Put('term')
    async updateProductsByTerm(@Body() body: ProductAdminUpdateByTermRequest): Promise<BaseResponse<void>> {
        await this.productAdminService.updateProductsByTerm(body);
        return BaseResponse.ok();
    }

    @Put('pay-and-usage')
    async updatePayAndUsage(@Body() body: ProductAdminUpdatePayAndUsageRequest): Promise<BaseResponse<void>> {
        await this.productAdminService.updatePayAndUsage(body);
        return BaseResponse.ok();
    }
}
