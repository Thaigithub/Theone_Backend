import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Query } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';

import { PostMemberService } from '../member/post-member.service';
import { PostMemberGetListPremiumRequest } from '../member/request/post-member-get-list-premium.request';
import { PostMemberGetListRequest } from '../member/request/post-member-get-list.request';
import { PostMemberGetDetailResponse } from '../member/response/post-member-get-detail.response';
import { PostMemberGetListPremiumResponse } from '../member/response/post-member-get-list-premium.response';
import { PostMemberGetListResponse } from '../member/response/post-member-get-list.response';

@Controller('/guest/posts')
export class PostGuestController {
    constructor(private postMemberService: PostMemberService) {}

    private async getListPost(
        query: PostMemberGetListRequest,
        occupationList: [string] | undefined,
        constructionMachineryList: [string],
        experienceTypeList: [string] | undefined,
        regionList: [string] | undefined,
        siteId: number | undefined,
    ): Promise<BaseResponse<PostMemberGetListResponse>> {
        query = { ...query, occupationList, constructionMachineryList, experienceTypeList, regionList };
        return BaseResponse.of(await this.postMemberService.getList(undefined, query, siteId));
    }

    // Get list all
    @Get()
    async getList(
        @Query() query: PostMemberGetListRequest,
        @Query('occupationList', new ParseArrayPipe({ optional: true })) occupationList: [string] | undefined,
        @Query('constructionMachineryList', new ParseArrayPipe({ optional: true })) constructionMachineryList: [string],
        @Query('experienceTypeList', new ParseArrayPipe({ optional: true })) experienceTypeList: [string] | undefined,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<PostMemberGetListResponse>> {
        return await this.getListPost(
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
    ): Promise<BaseResponse<PostMemberGetListResponse>> {
        return await this.getListPost(query, occupationList, constructionMachineryList, experienceTypeList, regionList, siteId);
    }

    @Get('/premium')
    async getPremium(@Query() query: PostMemberGetListPremiumRequest): Promise<BaseResponse<PostMemberGetListPremiumResponse>> {
        return BaseResponse.of(await this.postMemberService.getListPremium(undefined, query));
    }
    // Get detail
    @Get(':id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<PostMemberGetDetailResponse>> {
        return BaseResponse.of(await this.postMemberService.getDetail(id, undefined));
    }
}
