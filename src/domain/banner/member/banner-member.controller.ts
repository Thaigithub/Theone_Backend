import { Controller, Get } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { BannerMemberService } from './banner-member.service';
import { BannerMemberGetListResponse } from './response/banner-member-get-list.response';

@Controller('/member/banners')
export class BannerMemberController {
    constructor(private bannerMemberService: BannerMemberService) {}

    @Get()
    async getList(): Promise<BaseResponse<BannerMemberGetListResponse>> {
        return BaseResponse.of(await this.bannerMemberService.getList());
    }
}
