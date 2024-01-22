import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { TermAdminCreateRequest } from './request/term-admin-create.request';
import { TermAdminGetListRequest } from './request/term-admin-get-list.request';
import { TermAdminUpdateRequest } from './request/term-admin-update.request';
import { TermAdminGetDetailResponse } from './response/term-admin-get-detail.response';
import { TermAdminGetListResponse } from './response/term-admin-get-list.response';
import { TermAdminService } from './term-admin.service';

@Controller('/admin/terms')
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
export class TermAdminController {
    constructor(private termAdminService: TermAdminService) {}

    @Get()
    async getList(@Query() query: TermAdminGetListRequest): Promise<BaseResponse<TermAdminGetListResponse>> {
        return BaseResponse.of(await this.termAdminService.getList(query));
    }

    @Post()
    async create(@Body() body: TermAdminCreateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.termAdminService.create(body));
    }

    @Delete('/:id')
    async delete(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.termAdminService.delete(id));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<TermAdminGetDetailResponse>> {
        return BaseResponse.of(await this.termAdminService.getDetail(id));
    }

    @Put('/:id/')
    async update(@Param('id', ParseIntPipe) id: number, @Body() body: TermAdminUpdateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.termAdminService.update(id, body));
    }
}
