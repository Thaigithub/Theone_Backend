import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { SiteCompanyGetListContractRequest } from './request/site-company-get-list-contract.request';
import { SiteCompanyGetListRequest } from './request/site-company-get-list.request';
import { SiteCompanyUpsertRequest } from './request/site-company-upsert.request';
import { SiteCompanyGetDetailResponse } from './response/site-company-get-detail.response';
import { SiteCompanyGetListContractResponse } from './response/site-company-get-list-contract.response';
import { SiteCompanyGetListResponse } from './response/site-company-get-list.response';
import { SiteCompanyService } from './site-company.service';

@Controller('/company/sites')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
export class SiteCompanyController {
    constructor(private readonly siteCompanyService: SiteCompanyService) {}

    @Get('/contract')
    async getListContract(
        @Req() req: BaseRequest,
        @Query() query: SiteCompanyGetListContractRequest,
    ): Promise<BaseResponse<SiteCompanyGetListContractResponse>> {
        return BaseResponse.of(await this.siteCompanyService.getListContract(req.user.accountId, query));
    }

    @Get('/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: BaseRequest,
    ): Promise<BaseResponse<SiteCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.siteCompanyService.getDetail(id, request.user.accountId));
    }

    @Patch('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: SiteCompanyUpsertRequest,
        @Req() request: BaseRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.siteCompanyService.update(id, body, request.user.accountId));
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() request: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.siteCompanyService.delete(id, request.user.accountId));
    }

    @Get()
    async getList(
        @Query() query: SiteCompanyGetListRequest,
        @Req() request: BaseRequest,
    ): Promise<BaseResponse<SiteCompanyGetListResponse>> {
        return BaseResponse.of(await this.siteCompanyService.getList(query, request.user.accountId));
    }

    @Post()
    async create(@Body() body: SiteCompanyUpsertRequest, @Req() request: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.siteCompanyService.create(body, request.user.accountId));
    }
}
