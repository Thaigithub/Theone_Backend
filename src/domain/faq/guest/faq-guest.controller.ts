import { Controller, Get, Query } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { FaqGuestService } from './faq-guest.service';
import { FaqGuestGetListRequest } from './request/faq-guest-get-list.request';
import { FaqGuestGetListResponse } from './response/faq-guest-get-list.response';

@Controller('/guest/faqs')
export class FaqGuestController {
    constructor(private faqGuestService: FaqGuestService) {}

    @Get()
    async getList(@Query() query: FaqGuestGetListRequest): Promise<BaseResponse<FaqGuestGetListResponse>> {
        return BaseResponse.of(await this.faqGuestService.getList(query));
    }
}
