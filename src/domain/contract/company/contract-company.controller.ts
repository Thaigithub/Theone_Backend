import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { ContractCompanyService } from './contract-company.service';
import { ContractCompanyCreateRequest } from './request/contract-company-create.request';
import { ContractCompanyGetListForSiteRequest } from './request/contract-company-get-list-for-site.request';
import { ContractCompanySettlementGetListRequest } from './request/contract-company-settlement-get-list.request';
import { ContractCompanySettlementUpdateRequest } from './request/contract-company-settlement-update.request';
import { ContractCompanyUpdateRequest } from './request/contract-company-update.request';
import { ContractCompanyCountContractsResponse } from './response/contract-company-get-count-contract.response';
import { ContractCompanyGetDetailResponse } from './response/contract-company-get-detail.response';
import { ContractCompanyGetListForSiteResponse } from './response/contract-company-get-list-for-site.response';
import { ContractCompanySettlementGetListResponse } from './response/contract-company-settlement-get-list.response';
import { ContractCompanySettlementGetMemberDetailResponse } from './response/contract-company-settlement-get-member-detail.response';
import { ContractCompanySettlementGetTeamDetailResponse } from './response/contract-company-settlement-get-team-detail.response';

@Controller('/company/contracts')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ContractCompanyController {
    constructor(private contractCompanyService: ContractCompanyService) {}

    @Get('/count')
    async countPosts(@Req() req: BaseRequest): Promise<BaseResponse<ContractCompanyCountContractsResponse>> {
        return BaseResponse.of(await this.contractCompanyService.countContracts(req.user.accountId));
    }

    @Get('/site/:id')
    async getContractOnSite(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: BaseRequest,
        @Query() query: ContractCompanyGetListForSiteRequest,
    ): Promise<BaseResponse<ContractCompanyGetListForSiteResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getContractOnSite(id, request.user.accountId, query));
    }

    @Get('/settlement')
    async getSettlementMemberList(
        @Req() req: BaseRequest,
        @Query() query: ContractCompanySettlementGetListRequest,
    ): Promise<BaseResponse<ContractCompanySettlementGetListResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getSettlementList(req.user.accountId, query));
    }

    @Get('/:id/settlement/team')
    async getTeamSettlementDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ContractCompanySettlementGetTeamDetailResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getTeamSettlementDetail(req.user.accountId, id));
    }

    @Get('/:id/settlement/member')
    async getMemberSettlementDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ContractCompanySettlementGetMemberDetailResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getMemberSettlementDetail(req.user.accountId, id));
    }

    @Patch('/:id/settlement/status')
    async updateSettlementStatus(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
        @Body() body: ContractCompanySettlementUpdateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractCompanyService.updateSettlementStatus(req.user.accountId, id, body));
    }

    @Get('/:id')
    async getDetailContract(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ContractCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getDetail(id, req.user.accountId));
    }

    @Put('/:id')
    async updateContract(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
        @Body() body: ContractCompanyUpdateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractCompanyService.update(id, req.user.accountId, body));
    }

    @Post()
    async createContract(@Body() body: ContractCompanyCreateRequest, @Req() request: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractCompanyService.createContract(request.user.accountId, body));
    }
}
