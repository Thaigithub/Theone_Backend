import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Patch, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { InquiryAdminService } from './inquiry-admin.service';
import { InquiryAdminGetListRequest } from './request/inquiry-admin-get-list.request';
import { InquiryAdminAnswerRequest } from './request/inqury-admin-answer.request';
import { InquiryAdminGetDetailResponse } from './response/inquiry-admin-get-detail.reponse';
import { InquiryAdminGetListResponse } from './response/inquiry-admin-get-list.response';
@Controller('/admin/inquiries')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class InquiryAdminController {
    constructor(private inquiryAdminService: InquiryAdminService) {}

    @Get()
    async getList(@Query() query: InquiryAdminGetListRequest): Promise<BaseResponse<InquiryAdminGetListResponse>> {
        return BaseResponse.of(await this.inquiryAdminService.getList(query));
    }

    @Delete()
    async delete(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.inquiryAdminService.delete(ids));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<InquiryAdminGetDetailResponse>> {
        return BaseResponse.of(await this.inquiryAdminService.getDetail(id));
    }

    @Patch('/:id/answer')
    async updateAnswer(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: InquiryAdminAnswerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.inquiryAdminService.updateAnswer(id, body));
    }
}
