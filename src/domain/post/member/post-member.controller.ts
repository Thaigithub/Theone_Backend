import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pagination.response';
import { PostMemberService } from './post-member.service';
import { PostMemberGetListRequest } from './request/post-member-get-list.request';
import { PostMemberGetDetailResponse } from './response/post-member-get-detail.response';
import { PostMemberGetListResponse } from './response/post-member-get-list.response';
import { PostMemberUpdateInterestResponse } from './response/post-member-update-interest.response';

@Controller('/member/posts')
export class PostMemberController {
    constructor(private postMemberService: PostMemberService) {}

    private async getListPost(
        request: AccountIdExtensionRequest,
        query: PostMemberGetListRequest,
        occupationList: [string] | undefined,
        constructionMachineryList: [string],
        experienceTypeList: [string] | undefined,
        regionList: [string] | undefined,
        siteId: number,
    ): Promise<BaseResponse<PostMemberGetListResponse>> {
        query = { ...query, occupationList, constructionMachineryList, experienceTypeList, regionList };
        const list = await this.postMemberService.getList(request.user?.accountId, query, siteId);
        const total = await this.postMemberService.getTotal(query, siteId);
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    // Get list all
    @Get()
    async getList(
        @Query() query: PostMemberGetListRequest,
        @Query('occupationList', new ParseArrayPipe({ optional: true })) occupationList: [string] | undefined,
        @Query('constructionMachineryList', new ParseArrayPipe({ optional: true })) constructionMachineryList: [string],
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<PostMemberGetListResponse>> {
        return await this.getListPost(
            request,
            query,
            occupationList,
            constructionMachineryList,
            experienceTypeList,
            regionList,
            undefined,
        );
    }

    // Get list by site id
    @Get('sites/:id')
    async getListPostsBySite(
        @Param('id', ParseIntPipe) siteId: number,
        @Query() query: PostMemberGetListRequest,
        @Query('occupationList', new ParseArrayPipe({ optional: true })) occupationList: [string] | undefined,
        @Query('constructionMachineryList', new ParseArrayPipe({ optional: true })) constructionMachineryList: [string],
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<PostMemberGetListResponse>> {
        return await this.getListPost(
            request,
            query,
            occupationList,
            constructionMachineryList,
            experienceTypeList,
            regionList,
            siteId,
        );
    }

    // Get detail
    @Get(':id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<PostMemberGetDetailResponse>> {
        return BaseResponse.of(await this.postMemberService.getDetail(id, request.user?.accountId));
    }

    // Apply
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Post(':id/apply/member')
    async addApplyPostMember(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postMemberService.addApplyPostMember(request.user.accountId, id));
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Post(':id/apply/team/:teamId')
    async addApplyPost(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
        @Param('teamId', ParseIntPipe) teamId: number,
    ): Promise<BaseResponse<any>> {
        return await this.postMemberService.addApplyPostTeam(request.user.accountId, id, teamId);
    }

    // Interest

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Post('/:id/interest')
    async addInterestPost(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<PostMemberUpdateInterestResponse>> {
        return BaseResponse.of(await this.postMemberService.updateInterestPost(request.user.accountId, id));
    }
}
