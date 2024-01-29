import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CurrencyExchangeAdminService } from './currency-exchange-admin.service';
import { CurrencyExchangeAdminGetExchangeListRequest } from './request/currency-exchange-admin-get-list.request';
import { CurrencyExchangeAdminUpdateRequest } from './request/currency-exchange-admin-update.request';
import { CurrencyExchangeAdminGetListResponse } from './response/currency-exchange-admin-get-list.response';

@Controller('/admin/currency-exchange')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class CurrencyExchangeAdminController {
    constructor(private currencyExchangeAdminService: CurrencyExchangeAdminService) {}
    @Get()
    async getList(
        @Query() query: CurrencyExchangeAdminGetExchangeListRequest,
    ): Promise<BaseResponse<CurrencyExchangeAdminGetListResponse>> {
        return BaseResponse.of(await this.currencyExchangeAdminService.getList(query));
    }

    @Patch('/:id/status')
    async update(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: CurrencyExchangeAdminUpdateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.currencyExchangeAdminService.update(id, body));
    }
}
