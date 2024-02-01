import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { InquiryMemberService } from './inquiry-member.service';
import { InquiryMemberCreateRequest } from './request/inquiry-member-create.request';
import { InquiryMemberGetListRequest } from './request/inquiry-member-get-list.request';
import { InquiryMemberGetDetailResponse } from './response/inquiry-member-get-detail.response';
import { InquiryMemberGetListResponse } from './response/inquiry-member-get-list.response';
import { InquiryMemberGetCountRequest } from './request/inquiry-member-get-count.request';
import { InquiryMemberGetCountResponse } from './response/inquiry-member-get-count.response';
@Controller('/member/inquiries')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class InquiryMemberController {
    constructor(private inquiryMemberService: InquiryMemberService) {}

    @Get()
    async getList(
        @Query() query: InquiryMemberGetListRequest,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<InquiryMemberGetListResponse>> {
        return BaseResponse.of(await this.inquiryMemberService.getList(req.user.accountId, query));
    }

    @Post()
    async create(@Body() body: InquiryMemberCreateRequest, @Req() req: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.inquiryMemberService.create(req.user.accountId, body));
    }

    @Get('/count')
    async getTotal(
        @Req() req: BaseRequest,
        @Query() query: InquiryMemberGetCountRequest,
    ): Promise<BaseResponse<InquiryMemberGetCountResponse>> {
        return BaseResponse.of(await this.inquiryMemberService.getCount(req.user.accountId, query));
    }

    @Get('/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<InquiryMemberGetDetailResponse>> {
        return BaseResponse.of(await this.inquiryMemberService.getDetail(req.user.accountId, id));
    }
}
