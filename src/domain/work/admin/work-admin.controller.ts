import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator';
import { WorkAdminGetDetailListHistoryRequest } from './request/work-admin-get-detail-list-history.request';
import { WorkAdminGetListRequest } from './request/work-admin-get-list.request';
import { WorkAdminGetDetailListHistoryResponse } from './response/work-admin-get-detail-list-history.response';
import { WorkAdminGetDetailSiteResponse } from './response/work-admin-get-detail-site.response';
import { WorkAdminGetItemResponse, WorkAdminGetListResponse } from './response/work-admin-get-list.response';
import { WorkAdminService } from './work-admin.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@ApiBearerAuth()
@Controller('admin/work')
@ApiTags('[ADMIN] Work Management')
export class WorkAdminController {
    constructor(private readonly workAdminService: WorkAdminService) {}

    @Get()
    @ApiOperation({
        summary: 'Listing code',
        description: 'Admin can search code by code type',
    })
    @ApiOkResponsePaginated(WorkAdminGetItemResponse)
    async getList(@Query() query: WorkAdminGetListRequest): Promise<BaseResponse<WorkAdminGetListResponse>> {
        const code = await this.workAdminService.getList(query);
        return BaseResponse.of(code);
    }

    @Get(':id/site')
    @ApiOperation({
        summary: 'Get worker detail',
        description: 'Admin can view worker detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: WorkAdminGetDetailSiteResponse,
    })
    async getDetailSite(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<WorkAdminGetDetailSiteResponse>> {
        const code = await this.workAdminService.getDetailSite(id);
        return BaseResponse.of(code);
    }

    @Get(':siteId/work-history')
    @ApiOperation({
        summary: 'Get worker history detail',
        description: 'Admin can view worker history detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: WorkAdminGetDetailSiteResponse,
    })
    async getDetailHistory(
        @Param('siteId', ParseIntPipe) id: number,
        @Query() query: WorkAdminGetDetailListHistoryRequest,
    ): Promise<BaseResponse<WorkAdminGetDetailListHistoryResponse>> {
        const history = await this.workAdminService.getDetailHistory(id, query);
        return BaseResponse.of(history);
    }
}
