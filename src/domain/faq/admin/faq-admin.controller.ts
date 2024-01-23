import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { FaqAdminService } from './faq-admin.service';
import { FaqAdminCreateRequest } from './request/faq-admin-create.request';
import { FaqAdminGetListRequest } from './request/faq-admin-get-list.request';
import { FaqAdminUpdateRequest } from './request/faq-admin-update.request';
import { FaqAdminGetDetailResponse } from './response/faq-admin-get-detail.response';
import { FaqAdminGetListResponse } from './response/faq-admin-get-list.response';

@Controller('/admin/faqs')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class FaqAdminController {
    constructor(private faqAdminService: FaqAdminService) {}

    @Get()
    async getList(@Query() query: FaqAdminGetListRequest): Promise<BaseResponse<FaqAdminGetListResponse>> {
        return BaseResponse.of(await this.faqAdminService.getList(query));
    }

    @Post()
    async create(@Body() body: FaqAdminCreateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.faqAdminService.create(body));
    }

    @Delete()
    async delete(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.faqAdminService.delete(ids));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<FaqAdminGetDetailResponse>> {
        return BaseResponse.of(await this.faqAdminService.getDetail(id));
    }

    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: FaqAdminUpdateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.faqAdminService.update(id, body));
    }
}
