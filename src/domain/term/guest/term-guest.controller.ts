import { Controller, Get, Query } from '@nestjs/common';
import { BaseResponse } from 'utils/generics/base.response';
import { TermGuestGetListRequest } from './request/term-guest-get-list.request';
import { TermGuestGetListResponse } from './response/term-guest-get-list.response';
import { TermGuestService } from './term-guest.service';

@Controller('/guest/terms')
export class TermGuestController {
    constructor(private termMemberService: TermGuestService) {}

    @Get()
    async getList(@Query() query: TermGuestGetListRequest): Promise<BaseResponse<TermGuestGetListResponse>> {
        return BaseResponse.of(await this.termMemberService.getList(query));
    }
}
