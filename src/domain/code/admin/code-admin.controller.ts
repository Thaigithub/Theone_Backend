import { Body, Controller, Delete, Get, Param, ParseArrayPipe, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CodeAdminService } from './code-admin.service';
import { CodeAdminGetListRequest } from './request/code-admin-get-list.request';
import { CodeAdminUpsertRequest } from './request/code-admin-upsert.request';
import { CodeAdminGetDetailResponse } from './response/code-admin-get-detail.response';
import { CodeAdminGetListResponse } from './response/code-admin-get-list.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('/admin/codes')
export class CodeAdminController {
    constructor(private codeAdminService: CodeAdminService) {}

    @Get()
    async getList(@Query() query: CodeAdminGetListRequest): Promise<BaseResponse<CodeAdminGetListResponse>> {
        return BaseResponse.of(await this.codeAdminService.getList(query));
    }

    @Post()
    async create(@Body() request: CodeAdminUpsertRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.codeAdminService.create(request));
    }

    @Get('/:id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<CodeAdminGetDetailResponse>> {
        return BaseResponse.of(await this.codeAdminService.getDetail(id));
    }

    @Put('/:id')
    async update(@Param('id', ParseIntPipe) id: number, @Body() payload: CodeAdminUpsertRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.codeAdminService.update(id, payload));
    }

    @Delete()
    async delete(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.codeAdminService.delete(ids));
    }
}
