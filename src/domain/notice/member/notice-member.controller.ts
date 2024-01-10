import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { NoticeMemberService } from './notice-member.service';
import { NoticeMemberGetListResponse } from './response/notice-member-get-list.response';
import { NoticeMemberUpdateRequest } from './request/notice-member-update-request';

@Controller('/member/notices')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class NoticeMemberController {
    constructor(private noticeMemberService: NoticeMemberService) {}
    @Get()
    async getList(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: PaginationRequest,
    ): Promise<BaseResponse<NoticeMemberGetListResponse>> {
        return BaseResponse.of(await this.noticeMemberService.getList(req.user.accountId, query));
    }

    @Patch('/:id/status')
    async update(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: NoticeMemberUpdateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.noticeMemberService.update(req.user.accountId, id, body));
    }

    @Delete('/:id')
    async delete(@Req() req: AccountIdExtensionRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.noticeMemberService.delete(req.user.accountId, id));
    }
}
