import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { BaseResponse } from '../../../utils/generics/base.response';
import { CompanyAdminService } from './company-admin.service';
import { CompanyAdminDownloadListRequest } from './request/company-admin-download-list.request';
import { CompanyAdminGetListRequest } from './request/company-admin-get-list.request';
import { ComapnyAdminGetListProductRequest } from './request/company-admin-product-get-list.request';
import { CompanyAdminUpdateEmailRequest } from './request/company-admin-update-email.request';
import { CompanyAdminUpdateStatusRequest } from './request/company-admin-update-status.request';
import { CompanyAdminGetDetailResponse } from './response/company-admin-get-detail.response';
import { CompanyAdminGetListProductResponse } from './response/company-admin-get-list-product.response';
import { CompanyAdminGetListResponse } from './response/company-admin-get-list.response';

@Controller('/admin/companies')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class CompanyAdminController {
    constructor(private companyAdminService: CompanyAdminService) {}

    @Get('/product')
    async getListCompany(
        @Query() query: ComapnyAdminGetListProductRequest,
    ): Promise<BaseResponse<CompanyAdminGetListProductResponse>> {
        return BaseResponse.of(await this.companyAdminService.getListCompany(query));
    }

    @Get('/download')
    async download(
        @Query('companyIds') request: CompanyAdminDownloadListRequest | CompanyAdminDownloadListRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.companyAdminService.download(request, response));
    }

    @Get('/:id')
    async getDetails(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<CompanyAdminGetDetailResponse>> {
        return BaseResponse.of(await this.companyAdminService.getDetails(id));
    }

    @Get('/:id/product')
    async getCompanyInformation(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<any>> {
        return BaseResponse.of(await this.companyAdminService.getCompanyInformation(id));
    }

    @Patch('/:id/status')
    async changeStatus(
        @Param('id', ParseIntPipe) id,
        @Body() body: CompanyAdminUpdateStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.companyAdminService.changeStatus(id, body));
    }

    @Patch('/:id/email')
    async changeEmail(@Param('id', ParseIntPipe) id, @Body() body: CompanyAdminUpdateEmailRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.companyAdminService.changeEmail(id, body));
    }

    @Get()
    async getCompanies(@Query() request: CompanyAdminGetListRequest): Promise<BaseResponse<CompanyAdminGetListResponse>> {
        return BaseResponse.of(await this.companyAdminService.getCompanies(request));
    }
}
