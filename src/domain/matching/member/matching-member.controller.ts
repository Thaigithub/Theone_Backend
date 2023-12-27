import { Controller, Get, Param, ParseIntPipe, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { MatchingMemberService } from './matching-member.service';
import { MatchingMemberGetListRequest } from './request/matching-member-get-list.request';
import { MatchingMemberGetDetailResponse } from './response/matching-member-get-detail.response';
import { MatchingMemberGetListResponse } from './response/matching-member-get-list.response';
import { MatchingMemberInterestPostResponse } from './response/matching-member-interest-post.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
@ApiBearerAuth()
@Controller('member/matching')
@ApiTags('[MEMBER] Matching Management')
export class MatchingMemberController {
    constructor(private readonly matchingMemberService: MatchingMemberService) {}

    @Get()
    async getList(
        @Req() req: any,
        @Query() query: MatchingMemberGetListRequest,
    ): Promise<BaseResponse<MatchingMemberGetListResponse>> {
        return BaseResponse.of(await this.matchingMemberService.getList(req.user.accountId, query));
    }

    @Get(':id')
    async detailPost(
        @Req() req: any,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<MatchingMemberGetDetailResponse>> {
        return BaseResponse.of(await this.matchingMemberService.detailPost(req.user.accountId, id));
    }

    @Put(':id/refuse')
    async refusePost(@Req() req: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.matchingMemberService.refusePost(req.user.accountId, id));
    }

    @Put(':id/interest')
    async interestPost(
        @Req() req: any,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<MatchingMemberInterestPostResponse>> {
        return BaseResponse.of(await this.matchingMemberService.interestPost(req.user.accountId, id));
    }

    @Post(':id/individual-apply')
    async individualApplyPost(@Req() req: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.matchingMemberService.individualApplyPost(req.user.accountId, id));
    }

    @Post(':id/team-apply')
    async teamApplyPost(@Req() req: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.matchingMemberService.teamApplyPost(req.user.accountId, id));
    }
}
