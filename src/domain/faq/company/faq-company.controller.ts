import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { FaqCompanyService } from './faq-company.service';
import { FaqCompanyGetListRequest } from './request/faq-company-get-list.request';
import { FaqCompanyGetListResponse } from './response/faq-company-get-list.response';

@Controller('/company/faqs')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
export class FaqCompanyController {
    constructor(private faqCompanyService: FaqCompanyService) {}

    @Get()
    async getList(@Query() query: FaqCompanyGetListRequest): Promise<BaseResponse<FaqCompanyGetListResponse>> {
        return BaseResponse.of(await this.faqCompanyService.getList(query));
    }
}
