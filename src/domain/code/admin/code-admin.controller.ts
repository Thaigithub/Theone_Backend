import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseArrayPipe,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator';
import { CodeAdminService } from './code-admin.service';
import { CodeAdminGetListRequest } from './request/code-admin-get-list.request';
import { CodeAdminUpsertRequest } from './request/code-admin-upsert.request';
import { CodeAdminGetItemResponse } from './response/code-admin-get-item.response';
import { CodeAdminGetListResponse } from './response/code-admin-get-list.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@ApiBearerAuth()
@Controller('admin/code')
@ApiTags('[ADMIN] Code Management')
export class CodeAdminController {
    constructor(private readonly codeAdminService: CodeAdminService) {}

    @Get()
    @ApiOperation({
        summary: 'Listing code',
        description: 'Admin can search code by code type',
    })
    @ApiResponse({
        type: CodeAdminGetListResponse,
    })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({
        name: 'codeType',
        type: String,
        required: false,
        description: 'Code type for filter: ALL, SPECIAL_NOTE, JOB',
    })
    @ApiOkResponsePaginated(CodeAdminGetItemResponse)
    async getList(@Query() query: CodeAdminGetListRequest): Promise<BaseResponse<CodeAdminGetListResponse>> {
        const code = await this.codeAdminService.getList(query);
        return BaseResponse.of(code);
    }

    @Post('/create')
    @ApiOperation({
        summary: 'Create Code account',
        description: 'This endpoint creates a code in the system',
    })
    @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async create(@Body() request: CodeAdminUpsertRequest): Promise<BaseResponse<void>> {
        await this.codeAdminService.create(request);
        return BaseResponse.ok();
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Code detail',
        description: 'Retrieve code information detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: CodeAdminGetItemResponse,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<CodeAdminGetItemResponse>> {
        return BaseResponse.of(await this.codeAdminService.getCodeDetail(id));
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Change code information',
        description: 'Admin change code information',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async changeCodeInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: CodeAdminUpsertRequest,
    ): Promise<BaseResponse<void>> {
        await this.codeAdminService.changeCodeInfo(id, payload);
        return BaseResponse.ok();
    }

    @Delete()
    @ApiOperation({
        summary: 'Delete code',
        description: 'Admin can delete a code',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async deleteCode(
        @Query('ids', new ParseArrayPipe({ items: Number, separator: ',' }))
        ids: number[],
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.codeAdminService.deleteCode(ids));
    }
}
