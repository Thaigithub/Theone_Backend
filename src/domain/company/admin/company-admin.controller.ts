import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { Response } from 'express';
import { BaseResponse } from '../../../utils/generics/base.response';
import { AdminCompanyService } from './company-admin.service';
import { AdminCompanyDownloadListRequest, AdminCompanyDownloadRequest } from './request/company-admin-download-list.request';
import { AdminCompanyGetListRequest } from './request/company-admin-get-list.request';
import { AdminCompanyUpdateStatusRequest } from './request/company-admin-update-status.request';
import { AdminCompanyGetDetailsResponse } from './response/company-admin-get-detail.response';
import { AdminCompanyGetListResponse } from './response/company-admin-get-list.response';
@ApiTags('[ADMIN] Company Management')
@Controller('/admin/companies')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AdminCompanyController {
    constructor(private readonly adminCompanyService: AdminCompanyService) {}
    @Get('/:id/details/')
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Find company detail',
        description: 'This endpoint retrieves company details in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getDetails(@Param('id', ParseIntPipe) id): Promise<BaseResponse<AdminCompanyGetDetailsResponse>> {
        return BaseResponse.of(await this.adminCompanyService.getDetails(id));
    }

    @Patch('/:id/status')
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Change company status',
        description: 'This endpoint chaneg company status in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async changeStatus(
        @Param('id', ParseIntPipe) id,
        @Body() body: AdminCompanyUpdateStatusRequest,
    ): Promise<BaseResponse<null>> {
        await this.adminCompanyService.changeStatus(id, body);
        return BaseResponse.ok();
    }

    @Get()
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Find companies list',
        description: 'This endpoint retrieves comapnies list in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getCompanies(@Query() request: AdminCompanyGetListRequest): Promise<BaseResponse<AdminCompanyGetListResponse>> {
        return BaseResponse.of(await this.adminCompanyService.getCompanies(request));
    }

    @Get('/download')
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Find companies list',
        description: 'This endpoint retrieves comapnies list in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async download(
        @Param() request: AdminCompanyDownloadListRequest | AdminCompanyDownloadRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<null>> {
        await this.adminCompanyService.download(request, response);
        return BaseResponse.ok();
    }
}
