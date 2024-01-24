import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { FaqMemberService } from './faq-member.service';
import { FaqMemberGetListRequest } from './request/faq-member-get-list.request';
import { FaqMemberGetListResponse } from './response/faq-member-get-list.response';

@Controller('/member/faqs')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.MEMBER)
export class FaqMemberController {
    constructor(private faqMemberService: FaqMemberService) {}

    @Get()
    async getList(@Query() query: FaqMemberGetListRequest): Promise<BaseResponse<FaqMemberGetListResponse>> {
        return BaseResponse.of(await this.faqMemberService.getList(query));
    }
}
