import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { SiteCompanyCreateRequest } from './request/site-company-create.request';
import { SiteCompanyGetListForContractRequest } from './request/site-company-get-list-contract.request';
import { SiteCompanyGetListRequest } from './request/site-company-get-list.request';
import { SiteCompanyUpdateRequest } from './request/site-company-update.request';
import { SiteCompanyGetDetailResponse } from './response/site-company-get-detail.response';
import { SiteCompanyGetListForContractResponse } from './response/site-company-get-list-contract.response';
import { SiteCompanyGetListResponse } from './response/site-company-get-list.response';
import { SiteCompanyService } from './site-company.service';

@Controller('company/sites')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
export class SiteCompanyController {
    constructor(private readonly siteCompanyService: SiteCompanyService) {}

    @Get('/contract')
    async getListContract(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: SiteCompanyGetListForContractRequest,
    ): Promise<BaseResponse<SiteCompanyGetListForContractResponse>> {
        return BaseResponse.of(await this.siteCompanyService.getListContract(req.user.accountId, query));
    }

    @Get('/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<SiteCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.siteCompanyService.getDetail(id, request.user.accountId));
    }

    @Patch('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: SiteCompanyUpdateRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        await this.siteCompanyService.update(id, body, request.user.accountId);
        return BaseResponse.ok();
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number, @Req() request: AccountIdExtensionRequest): Promise<BaseResponse<void>> {
        await this.siteCompanyService.delete(id, request.user.accountId);
        return BaseResponse.ok();
    }

    @Get()
    async getList(
        @Query() query: SiteCompanyGetListRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<SiteCompanyGetListResponse>> {
        const list = await this.siteCompanyService.getList(query, request.user.accountId);
        const total = await this.siteCompanyService.getTotal(query, request.user.accountId);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Post()
    async createS(
        @Body() body: SiteCompanyCreateRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        await this.siteCompanyService.create(body, request.user.accountId);
        return BaseResponse.ok();
    }
}
