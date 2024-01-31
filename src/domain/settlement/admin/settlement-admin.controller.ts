import { Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { SettlementAdminAmountRequest } from './request/settlement-admin-get-amount.request';
import { SettlementAdminGetListRequest } from './request/settlement-admin-get-list.request';
import { SettlementAdminGetDetail } from './response/settlement-admin-get-detail.response';
import { SettlementAdminGetListResponse } from './response/settlement-admin-get-list.response';
import { SettlementAdminService } from './settlement-admin.service';

@Controller('/admin/settlements')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class SettlementAdminController {
    constructor(private settlementAdminService: SettlementAdminService) {}

    @Get('/amount/count')
    async getAmount(@Query() query: SettlementAdminAmountRequest) {
        return BaseResponse.of(await this.settlementAdminService.getAmount(query));
    }

    @Patch('/:id/status')
    async update(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.settlementAdminService.update(id));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<SettlementAdminGetDetail>> {
        return BaseResponse.of(await this.settlementAdminService.getDetail(id));
    }

    @Get()
    async getList(@Query() query: SettlementAdminGetListRequest): Promise<BaseResponse<SettlementAdminGetListResponse>> {
        return BaseResponse.of(await this.settlementAdminService.getList(query));
    }
}
