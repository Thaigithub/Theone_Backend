import { Controller, Get } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { BannerMemberService } from '../member/banner-member.service';
import { BannerMemberGetListResponse } from '../member/response/banner-member-get-list.response';

@Controller('/guest/banners')
export class BannerGuestController {
    constructor(private bannerMemberService: BannerMemberService) {}

    @Get()
    async getList(): Promise<BaseResponse<BannerMemberGetListResponse>> {
        return BaseResponse.of(await this.bannerMemberService.getList(undefined));
    }
}
