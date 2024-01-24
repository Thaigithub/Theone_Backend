import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { ReportMemberService } from './report-member.service';
import { BaseRequest } from 'utils/generics/base.request';
import { ReportMemberCreateRequest } from './request/report-member-create.request';
import { BaseResponse } from 'utils/generics/base.response';
import { ReportMemberGetListRequest } from './request/report-member-get-list.request';
import { ReportMemberGetListResponse } from './response/report-member-get-list.response';
import { ReportMemberGetDetailResponse } from './response/report-member-get-detail.response';

@Controller('/member/reports')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class ReportMemberController {
    constructor(private readonly reportMemberService: ReportMemberService) {}

    @Post()
    async create(@Req() request: BaseRequest, @Body() body: ReportMemberCreateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.reportMemberService.create(request.user.accountId, body));
    }

    @Get()
    async getList(
        @Req() request: BaseRequest,
        @Query() query: ReportMemberGetListRequest,
    ): Promise<BaseResponse<ReportMemberGetListResponse>> {
        return BaseResponse.of(await this.reportMemberService.getList(request.user.accountId, query));
    }

    @Get('/:id')
    async getDetail(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ReportMemberGetDetailResponse>> {
        return BaseResponse.of(await this.reportMemberService.getDetail(request.user.accountId, id));
    }
}
