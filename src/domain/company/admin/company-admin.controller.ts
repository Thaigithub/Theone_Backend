import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator.reponse';
import { BaseResponse } from '../../../utils/generics/base.response';
import { AdminCompanyService } from './company-admin.service';
import { AdminCompanyDownloadListRequest, AdminCompanyDownloadRequest } from './request/company-admin-download-list.request';
import { AdminCompanyGetListRequest } from './request/company-admin-get-list.request';
import { AdminCompanyUpdateEmailRequest } from './request/company-admin-update-email.request';
import { AdminCompanyUpdateStatusRequest } from './request/company-admin-update-status.request';
import { AdminCompanyGetDetailsResponse } from './response/company-admin-get-detail.response';
import { AdminCompanyGetListResponse, CompanyResponse } from './response/company-admin-get-list.response';
@ApiTags('[ADMIN] Company Management')
@Controller('/admin/companies')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AdminCompanyController {
    constructor(private readonly adminCompanyService: AdminCompanyService) {}
    @Get('/:id')
    @ApiOperation({
        summary: 'Find company detail',
        description: 'This endpoint retrieves company details in the system.',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'Successfully retrieve company detail',
        type: AdminCompanyGetDetailsResponse,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Company id not found', type: BaseResponse })
    async getDetails(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<AdminCompanyGetDetailsResponse>> {
        return BaseResponse.of(await this.adminCompanyService.getDetails(id));
    }

    @Patch('/:id/status')
    @ApiOperation({
        summary: 'Change company status',
        description: 'This endpoint chaneg company status in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully change status of the company', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Company id not found', type: BaseResponse })
    async changeStatus(
        @Param('id', ParseIntPipe) id,
        @Body() body: AdminCompanyUpdateStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminCompanyService.changeStatus(id, body));
    }

    @Patch('/:id/email')
    @ApiOperation({
        summary: 'Change company email',
        description: 'This endpoint chaneg company status in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully change email of the company', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Company id not found', type: BaseResponse })
    async changeEmail(@Param('id', ParseIntPipe) id, @Body() body: AdminCompanyUpdateEmailRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminCompanyService.changeEmail(id, body));
    }

    @Get()
    @ApiOperation({
        summary: 'Find companies list',
        description: 'This endpoint retrieves comapnies list in the system.',
    })
    @ApiOkResponsePaginated(CompanyResponse)
    async getCompanies(@Query() request: AdminCompanyGetListRequest): Promise<BaseResponse<AdminCompanyGetListResponse>> {
        return BaseResponse.of(await this.adminCompanyService.getCompanies(request));
    }

    @Get('/download')
    @ApiOperation({
        summary: 'Find companies list',
        description: 'This endpoint retrieves comapnies list in the system.',
    })
    @ApiQuery({ name: 'companyIds', type: AdminCompanyDownloadRequest })
    @ApiResponse({ status: HttpStatus.OK, description: 'Successfully dơnload the companies', type: BaseResponse })
    async download(
        @Query('companyIds') request: AdminCompanyDownloadListRequest | AdminCompanyDownloadRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.adminCompanyService.download(request, response));
    }
}
