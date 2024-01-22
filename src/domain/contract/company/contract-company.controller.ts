import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { ContractCompanyService } from './contract-company.service';
import { ContractCompanyCreateRequest } from './request/contract-company-create.request';
import { ContractCompanyUpdateRequest } from './request/contract-company-update.request';
import { ContractCompanyGetDetailResponse } from './response/contract-company-get-detail.response';
import { ContractCompanyGetListForSiteResponse } from './response/contract-company-get-list-for-site.response';
import { ContractCompanyGetTotalResponse } from './response/contract-company-get-total.response';
import { ContractCompanyGetListSiteRequest } from './request/contract-company-get-list-for-site.request';
import { ContractCompanyGetListSettlementRequest } from './request/contract-company-get-list-settlement.request';
import { ContractCompanyGetListSettlementResponse } from './response/contract-company-get-list-settlement.response';
import { ContractCompanyGetDetailSettlementTeamResponse } from './response/contract-company-get-detail-settlement-team.response';
import { ContractCompanyGetDetailSettlementMemberResponse } from './response/contract-company-get-detail-settlement-member.response';
import { ContractCompanyUpdateSettlementStatusRequest } from './request/contract-company-update-settlement-status.request';

@Controller('/company/contracts')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ContractCompanyController {
    constructor(private contractCompanyService: ContractCompanyService) {}

    @Get('/count')
    async count(@Req() req: BaseRequest): Promise<BaseResponse<ContractCompanyGetTotalResponse>> {
        return BaseResponse.of(await this.contractCompanyService.count(req.user.accountId));
    }

    @Get('/site/:id')
    async getListSite(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: BaseRequest,
        @Query() query: ContractCompanyGetListSiteRequest,
    ): Promise<BaseResponse<ContractCompanyGetListForSiteResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getListSite(id, request.user.accountId, query));
    }

    @Get('/settlement')
    async getListSettlement(
        @Req() req: BaseRequest,
        @Query() query: ContractCompanyGetListSettlementRequest,
    ): Promise<BaseResponse<ContractCompanyGetListSettlementResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getListSettlement(req.user.accountId, query));
    }

    @Get('/:id/settlement/team')
    async getDetailSettlementTeam(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ContractCompanyGetDetailSettlementTeamResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getDetailSettlementTeam(req.user.accountId, id));
    }

    @Get('/:id/settlement/member')
    async getDetailSettlementMember(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ContractCompanyGetDetailSettlementMemberResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getDetailSettlementMember(req.user.accountId, id));
    }

    @Patch('/:id/settlement/status')
    async updateSettlementStatus(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
        @Body() body: ContractCompanyUpdateSettlementStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractCompanyService.updateSettlementStatus(req.user.accountId, id, body));
    }

    @Get('/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ContractCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.contractCompanyService.getDetail(id, req.user.accountId));
    }

    @Put('/:id')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
        @Body() body: ContractCompanyUpdateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractCompanyService.update(id, req.user.accountId, body));
    }

    @Post()
    async create(@Body() body: ContractCompanyCreateRequest, @Req() request: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractCompanyService.create(request.user.accountId, body));
    }
}
