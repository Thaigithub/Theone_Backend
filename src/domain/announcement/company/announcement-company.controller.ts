import { Controller, Get, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { AnnouncementCompanyService } from './announcement-company.service';
import { AnnouncementCompanyGetListRequest } from './request/announcement-company-get-list.request';
import { AnnouncementCompanyGetDetailResponse } from './response/announcement-company-get-detail.response';
import { AnnouncementCompanyGetListResponse } from './response/announcement-company-get-list.response';

@Controller('/company/announcements')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
export class AnnouncementCompanyController {
    constructor(private announcementCompanyService: AnnouncementCompanyService) {}

    @Get()
    async getList(@Query() query: AnnouncementCompanyGetListRequest): Promise<BaseResponse<AnnouncementCompanyGetListResponse>> {
        return BaseResponse.of(await this.announcementCompanyService.getList(query));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<AnnouncementCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.announcementCompanyService.getDetail(id));
    }
}
