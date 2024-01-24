import { Body, Controller, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { MemoMemberService } from './memo-member.service';
import { MemoMemberGetListRequest } from './request/memo-member-get-list.request';
import { MemoMemberUpsertRequest } from './request/memo-member-upsert.request';
import { MemoMemberGetDetailResponse } from './response/memo-member-get-detail.response';
import { MemoMemberGetListResponse } from './response/memo-member-get-list.response';

@Controller('/member/memos')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class MemoMemberController {
    constructor(private memoMemberService: MemoMemberService) {}

    @Get()
    async getList(
        @Req() req: BaseRequest,
        @Query() query: MemoMemberGetListRequest,
    ): Promise<BaseResponse<MemoMemberGetListResponse>> {
        return BaseResponse.of(await this.memoMemberService.getList(req.user.accountId, query));
    }

    @Get('/:id')
    async getDetail(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<MemoMemberGetDetailResponse>> {
        return BaseResponse.of(await this.memoMemberService.getDetail(req.user.accountId, id));
    }

    @Put('/:id')
    async update(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: MemoMemberUpsertRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memoMemberService.update(req.user.accountId, id, body));
    }

    @Post()
    async create(@Req() req: BaseRequest, @Body() body: MemoMemberUpsertRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memoMemberService.create(req.user.accountId, body));
    }
}
