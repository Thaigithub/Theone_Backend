import { Body, Controller, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ContractAdminService } from './contract-admin.service';
import { ContractAdminGetListSettlementRequest } from './request/contract-admin-get-list-settlement.request';
import { ContractAdminGetListRequest } from './request/contract-admin-get-list.request';
import { ContractAdminUpdateSettlementStatusRequest } from './request/contract-admin-update-settlement-status.request';
import { ContractAdminUpsertFileRequest } from './request/contract-admin-upsert-file.request';
import { ContractAdminGetDetailSettlementResponse } from './response/contract-admin-get-detail-settlement.response';
import { ContractAdminGetListSettlementResponse } from './response/contract-admin-get-list-settlement.response';
import { ContractAdminGetListResponse } from './response/contract-admin-get-list.response';
import { ContractAdminGetTotalResponse } from './response/contract-admin-get-total.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('/admin/contracts')
export class ContractAdminController {
    constructor(private readonly contractAdminService: ContractAdminService) {}

    @Get()
    async getList(@Query() query: ContractAdminGetListRequest): Promise<BaseResponse<ContractAdminGetListResponse>> {
        return BaseResponse.of(await this.contractAdminService.getList(query));
    }

    @Get('/count')
    async getTotal(@Query() query: ContractAdminGetListRequest): Promise<BaseResponse<ContractAdminGetTotalResponse>> {
        return BaseResponse.of(await this.contractAdminService.getTotal(query));
    }

    @Get('/settlement')
    async getListSettlement(
        @Query() query: ContractAdminGetListSettlementRequest,
    ): Promise<BaseResponse<ContractAdminGetListSettlementResponse>> {
        return BaseResponse.of(await this.contractAdminService.getListSettlement(query));
    }

    @Get('/:id/settlement')
    async getDetailSettlement(
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ContractAdminGetDetailSettlementResponse>> {
        return BaseResponse.of(await this.contractAdminService.getDetailSettlement(id));
    }

    @Patch('/:id/settlement/status')
    async updateSettlementStatus(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ContractAdminUpdateSettlementStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.contractAdminService.updateSettlementStatus(id, body));
    }

    @Post('/:id/file')
    async createFile(@Param('id', ParseIntPipe) id: number, @Body() body: ContractAdminUpsertFileRequest) {
        return BaseResponse.of(await this.contractAdminService.createFile(id, body));
    }

    @Patch('/:id/file')
    async updateFile(@Param('id', ParseIntPipe) id: number, @Body() body: ContractAdminUpsertFileRequest) {
        return BaseResponse.of(await this.contractAdminService.updateFile(id, body));
    }
}
