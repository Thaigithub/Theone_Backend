import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { AnnouncementGuestService } from './announcement-guest.service';
import { AnnouncementGuestGetListRequest } from './request/announcement-guest-get-list.request';
import { AnnouncementGuestGetListResponse } from './response/announcement-guest-get-list.response';
import { AnnouncementGuestGetDetailResponse } from './response/announcement-guest-get-detail.response';
import { BaseResponse } from 'utils/generics/base.response';

// utils/generics/base.response
@Controller('/guest/announcements')
export class AnnouncementGuestController {
    constructor(private announcementGuestService: AnnouncementGuestService) {}

    @Get()
    async getList(@Query() query: AnnouncementGuestGetListRequest): Promise<BaseResponse<AnnouncementGuestGetListResponse>> {
        return BaseResponse.of(await this.announcementGuestService.getList(query));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<AnnouncementGuestGetDetailResponse>> {
        return BaseResponse.of(await this.announcementGuestService.getDetail(id));
    }
}
