import { Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { SettlementCompanyGetListRequest } from './request/settlement-company-get-list.request';
import { SettlementCompanyGetDetail } from './response/settlement-company-get-detail.response';
import { SettlementCompanyGetListResponse } from './response/settlement-company-get-list.response';
import { SettlementCompanyService } from './settlement-company.service';

@Controller('/company/settlements')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
export class SettlementCompanyController {
    constructor(private settlementCompanyService: SettlementCompanyService) {}

    @Patch('/:id/status')
    async update(@Req() req: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.settlementCompanyService.update(req.user.accountId, id));
    }

    @Get('/:id')
    async getDetail(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<SettlementCompanyGetDetail>> {
        return BaseResponse.of(await this.settlementCompanyService.getDetail(req.user.accountId, id));
    }

    @Get()
    async getList(
        @Req() req: BaseRequest,
        @Query() query: SettlementCompanyGetListRequest,
    ): Promise<BaseResponse<SettlementCompanyGetListResponse>> {
        return BaseResponse.of(await this.settlementCompanyService.getList(req.user.accountId, query));
    }
}
