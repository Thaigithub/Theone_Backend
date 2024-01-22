import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { MemberAdminService } from './member-admin.service';
import {
    ChangeMemberRequest,
    DownloadMembersRequest,
    DownloadSingleMemberRequest,
    GetMembersListRequest,
} from './request/member-admin.request';
import { MemberAdminGetDetailResponse } from './response/member-admin-get-detail.response';
import { MemberAdminGetListResponse } from './response/member-admin-get-list.response';

@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Controller('/admin/members')
export class MemberAdminController {
    constructor(private readonly memberAdminService: MemberAdminService) {}

    @Get()
    async getList(@Query() query: GetMembersListRequest): Promise<BaseResponse<MemberAdminGetListResponse>> {
        const membersList = await this.memberAdminService.getList(query);
        const membersTotal = await this.memberAdminService.getTotal(query);
        const paginationResponse = new PaginationResponse(membersList, new PageInfo(membersTotal));
        return BaseResponse.of(paginationResponse);
    }

    @Get('/download')
    async download(
        @Query() query: DownloadSingleMemberRequest | DownloadMembersRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        let memberIds = [];
        if (Array.isArray(query.memberId)) {
            memberIds = query.memberId.map((item) => parseInt(item));
        } else if (typeof query.memberId === 'string') memberIds = [parseInt(query.memberId)];
        return BaseResponse.of(await this.memberAdminService.download(memberIds, response));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<MemberAdminGetDetailResponse>> {
        return BaseResponse.of(await this.memberAdminService.getDetail(id));
    }

    @Patch('/:id')
    async changeMemberInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ChangeMemberRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memberAdminService.updateMember(id, body));
    }
}
