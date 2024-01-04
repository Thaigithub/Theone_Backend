import { Controller, Get, Param, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CurrencyExchangeAdminService } from './currency-exchange-admin.service';
import { CurrencyExchangeAdminGetExchangeListRequest } from './request/currency-exchange-admin-get-list.request';
import { CurrencyExchangeAdminGetListResponse } from './response/currency-exchange-admin-get-list.response';

@ApiTags('[ADMIN] Currency Exchange Management')
@Controller('/admin/currency-exchange')
@ApiBearerAuth()
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
export class CurrencyExchangeAdminController {
    constructor(private currencyExchangeAdminService: CurrencyExchangeAdminService) {}
    @Get()
    async getExchangeList(
        @Query() query: CurrencyExchangeAdminGetExchangeListRequest,
    ): Promise<BaseResponse<CurrencyExchangeAdminGetListResponse>> {
        return BaseResponse.of(await this.currencyExchangeAdminService.getList(query));
    }

    @Patch('/:id/approve')
    async approve(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.currencyExchangeAdminService.approve(id));
    }

    @Patch('/:id/deny')
    async deny(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.currencyExchangeAdminService.deny(id));
    }
}
