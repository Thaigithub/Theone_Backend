import { Body, Controller, Get, HttpStatus, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PointMemberService } from './point-member.service';
import { PointMemberCreateCurrencyExchangeRequest } from './request/point-member-create-currency-exchange.request';
import {
    PointMemberExchangePointResponse,
    PointMemberGetExchangePointListResponse,
} from './response/point-member-get-exchange-list.response';
import { PointMemberGetPointListResponse, PointMemberPointResponse } from './response/point-member-get-list.response.ts';

@ApiTags('[MEMBER] Point Management')
@Controller('/member/points')
@ApiBearerAuth()
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
export class PointMemberController {
    constructor(private pointMemberService: PointMemberService) {}
    @Get('/accumulations')
    @ApiOperation({
        summary: 'List earning point histories',
        description: 'Member can list all points that they have received',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The earning point lists retrieved successfully',
        type: PointMemberPointResponse,
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    async getPointList(
        @Req() req: any,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<PointMemberGetPointListResponse>> {
        const pointList = await this.pointMemberService.getPointList(req.user.accountId, query);
        return BaseResponse.of(pointList);
    }

    @Get('/exchanges')
    @ApiOperation({
        summary: 'List exchange point histories',
        description: 'Member can list exchange points',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The exchange point lists retrieved successfully',
        type: PointMemberExchangePointResponse,
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    async getExchangePointList(
        @Req() req: any,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<PointMemberGetExchangePointListResponse>> {
        const exchangeList = await this.pointMemberService.getExchangePointList(req.user.accountId, query);
        return BaseResponse.of(exchangeList);
    }

    @Post('/exchanges')
    @ApiOperation({
        summary: 'Create new exchange',
        description: 'Member can exchange points into currency',
    })
    @ApiResponse({
        type: BaseResponse,
        description: 'Create new exchange currency successfully',
        status: HttpStatus.OK,
    })
    async createCurrencyExchange(
        @Body() body: PointMemberCreateCurrencyExchangeRequest,
        @Req() request: any,
    ): Promise<BaseResponse<void>> {
        await this.pointMemberService.createCurrencyExchange(request.user.accountId, body);
        return BaseResponse.ok();
    }
}
