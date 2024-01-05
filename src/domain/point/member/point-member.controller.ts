import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PointMemberService } from './point-member.service';
import { PointMemberCreateCurrencyExchangeRequest } from './request/point-member-create-currency-exchange.request';
import { PointMemberGetExchangePointListResponse } from './response/point-member-get-exchange-list.response';
import { PointMemberGetPointListResponse } from './response/point-member-get-list.response.ts';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';

@ApiTags('[MEMBER] Point Management')
@Controller('/member/points')
@ApiBearerAuth()
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
export class PointMemberController {
    constructor(private pointMemberService: PointMemberService) {}
    @Get('/accumulations')
    async getPointList(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<PointMemberGetPointListResponse>> {
        return BaseResponse.of(await this.pointMemberService.getPointList(req.user.accountId, query));
    }

    @Get('/exchanges')
    async getExchangePointList(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<PointMemberGetExchangePointListResponse>> {
        return BaseResponse.of(await this.pointMemberService.getExchangePointList(req.user.accountId, query));
    }

    @Post('/exchanges')
    async createCurrencyExchange(
        @Body() body: PointMemberCreateCurrencyExchangeRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.pointMemberService.createCurrencyExchange(request.user.accountId, body));
    }
}
