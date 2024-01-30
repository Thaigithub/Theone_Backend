import { Body, Controller, Get, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PointMemberService } from './point-member.service';
import { PointMemberCreateCurrencyExchangeRequest } from './request/point-member-create-currency-exchange.request';
import { PointMemberCreateRequest } from './request/point-member-create-point.request';
import { PointMemberGetListRequest } from './request/point-member-get-list.request';
import { PointMemberGetCountResponse } from './response/point-member-get-count.response';
import { PointMemberGetListResponse } from './response/point-member-get-list.response.ts';

@Controller('/member/points')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class PointMemberController {
    constructor(private pointMemberService: PointMemberService) {}

    @Get('/count')
    async getCount(@Req() req: BaseRequest): Promise<BaseResponse<PointMemberGetCountResponse>> {
        return BaseResponse.of(await this.pointMemberService.getCount(req.user.accountId));
    }

    @Get('/exchanges')
    async getExchangeList(
        @Req() req: BaseRequest,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<PointMemberGetListResponse>> {
        return BaseResponse.of(await this.pointMemberService.getExchangeList(req.user.accountId, query));
    }

    @Post('/exchanges')
    async createCurrencyExchange(
        @Body() body: PointMemberCreateCurrencyExchangeRequest,
        @Req() request: BaseRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.pointMemberService.createCurrencyExchange(request.user.accountId, body));
    }

    @Post()
    async createPointHistory(@Req() req: BaseRequest, @Body() body: PointMemberCreateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.pointMemberService.createPointHistory(req.user.accountId, body));
    }

    @Get()
    async getList(
        @Req() req: BaseRequest,
        @Query() query: PointMemberGetListRequest,
    ): Promise<BaseResponse<PointMemberGetListResponse>> {
        return BaseResponse.of(await this.pointMemberService.getList(req.user.accountId, query));
    }
}
