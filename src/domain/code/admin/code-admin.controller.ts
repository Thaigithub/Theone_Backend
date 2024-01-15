import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseArrayPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CodeAdminService } from './code-admin.service';
import { CodeAdminGetListRequest } from './request/code-admin-get-list.request';
import { CodeAdminUpsertRequest } from './request/code-admin-upsert.request';
import { CodeAdminGetItemResponse } from './response/code-admin-get-item.response';
import { CodeAdminGetListResponse } from './response/code-admin-get-list.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('admin/code')
export class CodeAdminController {
    constructor(private readonly codeAdminService: CodeAdminService) {}

    @Get()
    async getList(@Query() query: CodeAdminGetListRequest): Promise<BaseResponse<CodeAdminGetListResponse>> {
        const code = await this.codeAdminService.getList(query);
        return BaseResponse.of(code);
    }

    @Post('/create')
    async create(@Body() request: CodeAdminUpsertRequest): Promise<BaseResponse<void>> {
        await this.codeAdminService.create(request);
        return BaseResponse.ok();
    }

    @Get(':id')
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<CodeAdminGetItemResponse>> {
        return BaseResponse.of(await this.codeAdminService.getCodeDetail(id));
    }

    @Patch(':id')
    async changeCodeInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CodeAdminUpsertRequest,
    ): Promise<BaseResponse<void>> {
        await this.codeAdminService.changeCodeInfo(id, payload);
        return BaseResponse.ok();
    }

    @Delete()
    async deleteCode(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.codeAdminService.deleteCode(ids));
    }
}
