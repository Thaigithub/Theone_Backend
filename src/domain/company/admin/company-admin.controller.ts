import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { BaseResponse } from '../../../utils/generics/base.response';
import { AdminCompanyService } from './company-admin.service';
import { AdminCompanyDownloadListRequest, AdminCompanyDownloadRequest } from './request/company-admin-download-list.request';
import { AdminCompanyGetListRequest } from './request/company-admin-get-list.request';
import { AdminCompanyUpdateEmailRequest } from './request/company-admin-update-email.request';
import { AdminCompanyUpdateStatusRequest } from './request/company-admin-update-status.request';
import { AdminCompanyGetDetailsResponse } from './response/company-admin-get-detail.response';
import { AdminCompanyGetListResponse } from './response/company-admin-get-list.response';

@Controller('/admin/companies')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class AdminCompanyController {
    constructor(private readonly adminCompanyService: AdminCompanyService) {}

    @Get('/download')
    async download(
        @Query('companyIds') request: AdminCompanyDownloadListRequest | AdminCompanyDownloadRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminCompanyService.download(request, response));
    }

    @Get('/:id')
    async getDetails(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<AdminCompanyGetDetailsResponse>> {
        return BaseResponse.of(await this.adminCompanyService.getDetails(id));
    }

    @Patch('/:id/status')
    async changeStatus(
        @Param('id', ParseIntPipe) id,
        @Body() body: AdminCompanyUpdateStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminCompanyService.changeStatus(id, body));
    }

    @Patch('/:id/email')
    async changeEmail(@Param('id', ParseIntPipe) id, @Body() body: AdminCompanyUpdateEmailRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminCompanyService.changeEmail(id, body));
    }

    @Get()
    async getCompanies(@Query() request: AdminCompanyGetListRequest): Promise<BaseResponse<AdminCompanyGetListResponse>> {
        return BaseResponse.of(await this.adminCompanyService.getCompanies(request));
    }
}
