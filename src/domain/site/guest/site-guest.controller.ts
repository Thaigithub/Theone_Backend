import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { SiteMemberService } from '../member/site-member.service';
import { SiteMemberGetDetailResponse } from '../member/response/site-member-get-detail.response';
import { SiteMemberGetListResponse } from '../member/response/site-member-get-list.response';
import { SiteMemberGetListRequest } from '../member/request/site-member-get-list.request';

@Controller('/guest/sites')
export class SiteGuestController {
    constructor(private siteMemberService: SiteMemberService) {}
    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<SiteMemberGetDetailResponse>> {
        return BaseResponse.of(await this.siteMemberService.getSiteDetail(undefined, id));
    }

    @Get()
    async getSites(@Query() query: SiteMemberGetListRequest): Promise<BaseResponse<SiteMemberGetListResponse>> {
        return BaseResponse.of(await this.siteMemberService.getSiteList(undefined, query));
    }
}
