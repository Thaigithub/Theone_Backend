import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { InquiryCompanyService } from './inquiry-company.service';
import { InquiryCompanyCreateRequest } from './request/inquiry-company-create.request';
import { InquiryCompanyGetListRequest } from './request/inquiry-company-get-list.request';
import { InquiryCompanyGetDetailResponse } from './response/inquiry-company-get-detail.response';
import { InquiryCompanyGetListResponse } from './response/inquiry-company-get-list.response';

@Controller('/company/inquiries')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
export class InquiryCompanyController {
    constructor(private inquiryCompanyService: InquiryCompanyService) {}

    @Get()
    async getList(
        @Query() query: InquiryCompanyGetListRequest,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<InquiryCompanyGetListResponse>> {
        return BaseResponse.of(await this.inquiryCompanyService.getList(req.user.accountId, query));
    }

    @Post()
    async create(@Body() body: InquiryCompanyCreateRequest, @Req() req: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.inquiryCompanyService.create(req.user.accountId, body));
    }

    @Get('/:id')
    async getDetail(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<InquiryCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.inquiryCompanyService.getDetail(req.user.accountId, id));
    }
}
