import { Body, Controller, Delete, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { InterestMemberService } from './interest-member.service';
import { InterestMemberDeleteRequest } from './request/interest-member-delete.request';
import { InterestMemberGetListRequest } from './request/interest-member-get-list.request';
import { InterestMemberGetListResponse } from './response/interest-member-get-list.response.ts';

@Controller('/member/interests')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class InterestMemberController {
    constructor(private interestMemberService: InterestMemberService) {}
    @Get()
    async getList(
        @Req() req: AccountIdExtensionRequest,
        @Query() query: InterestMemberGetListRequest,
    ): Promise<BaseResponse<InterestMemberGetListResponse>> {
        return BaseResponse.of(await this.interestMemberService.getList(req.user.accountId, query));
    }

    @Delete('/:id')
    async delete(
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() body: InterestMemberDeleteRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.interestMemberService.delete(req.user.accountId, id, body));
    }
}
