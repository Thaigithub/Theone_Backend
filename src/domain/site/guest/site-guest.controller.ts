import { Controller, Get, Param, ParseArrayPipe, ParseIntPipe, Query } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { SiteMemberGetListRequest } from '../member/request/site-member-get-list.request';
import { SiteMemberGetDetailResponse } from '../member/response/site-member-get-detail.response';
import { SiteMemberGetListResponse } from '../member/response/site-member-get-list.response';
import { SiteMemberService } from '../member/site-member.service';

@Controller('/guest/sites')
export class SiteGuestController {
    constructor(private siteMemberService: SiteMemberService) {}
    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<SiteMemberGetDetailResponse>> {
        return BaseResponse.of(await this.siteMemberService.getDetail(undefined, id));
    }

    @Get()
    async getSites(
        @Query() query: SiteMemberGetListRequest,
        @Query('regionList', new ParseArrayPipe({ optional: true })) regionList: [string] | undefined,
    ): Promise<BaseResponse<SiteMemberGetListResponse>> {
        return BaseResponse.of(await this.siteMemberService.getList(undefined, { ...query, regionList }));
    }
}
