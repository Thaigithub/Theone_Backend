import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ContractCompanyService } from './contract-company.service';
import { ContractCompanyCreateRequest } from './request/contract-company-create.request';
import { ContractCompanyGetListForSiteRequest } from './request/contract-company-get-list-for-site.request';
import { ContractCompanyUpdateRequest } from './request/contract-company-update.request';
import { ContractCompanyCountContractsResponse } from './response/contract-company-get-count-contract.response';
import { ContractCompanyGetDetailResponse } from './response/contract-company-get-detail.response';
import { ContractCompanyGetListForSiteResponse } from './response/contract-company-get-list-for-site.response';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';

@Controller('/company/contracts')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ContractCompanyController {
    constructor(private contractCompanyService: ContractCompanyService) {}

    @Get('/count')
    async countPosts(@Req() req: AccountIdExtensionRequest): Promise<BaseResponse<ContractCompanyCountContractsResponse>> {
        return BaseResponse.of(await this.contractCompanyService.countContracts(req.user.accountId));
    }

    @Get('/site/:id')
    async getContractOnSite(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: AccountIdExtensionRequest,
        @Query() query: ContractCompanyGetListForSiteRequest,
    ): Promise<BaseResponse<ContractCompanyGetListForSiteResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getContractOnSite(id, request.user.accountId, query));
    }

    @Get('/:id')
    async getDetailContract(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AccountIdExtensionRequest,
    ): Promise<BaseResponse<ContractCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getDetail(id, req.user.accountId));
    }

    @Put('/:id')
    async updateContract(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: AccountIdExtensionRequest,
        @Body() body: ContractCompanyUpdateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractCompanyService.update(id, req.user.accountId, body));
    }

    @Post()
    async createContract(
        @Body() body: ContractCompanyCreateRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractCompanyService.createContract(request.user.accountId, body));
    }
}
