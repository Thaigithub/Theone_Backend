import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApplicationAdminService } from './application-admin.service';
import { ApplicationAdminGetListRequest } from './request/application-admin-get-list.request';
import { ApplicationAdminGetDetailResponse } from './response/application-admin-get-detail.response';
import { ApplicationAdminGetResponse } from './response/application-admin-get-list.response';

@ApiTags('[ADMIN] Application Management')
@Controller('/admin/applications')
@ApiBearerAuth()
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
export class ApplicationAdminController {
    constructor(private applicationAdminService: ApplicationAdminService) {}
    @Get('/:id')
    @ApiOperation({
        summary: 'List applications',
        description: 'Admin can list applications based on their announcement id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The application lists retrieved successfully',
        type: ApplicationAdminGetListRequest,
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    async getApplicationList(
        @Param('id', ParseIntPipe) id: number,
        @Query() query: ApplicationAdminGetListRequest,
    ): Promise<BaseResponse<ApplicationAdminGetResponse>> {
        const applicationList = await this.applicationAdminService.getApplicationList(id, query);
        return BaseResponse.of(applicationList);
    }

    @Get('/infor/:id')
    @ApiOperation({
        summary: 'Retrieve application information',
        description: 'Admin can retrieve information based on their application id',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The application lists retrieved successfully',
        type: ApplicationAdminGetDetailResponse,
    })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Can not retrieve application information' })
    async getApplicationInfor(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<ApplicationAdminGetDetailResponse>> {
        const application = await this.applicationAdminService.getApplicationInfor(id);
        return BaseResponse.of(application);
    }
}
