import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { AccountIdExtensionRequest } from 'utils/generics/upsert-account.request';
import { SiteCompanyCreateRequest } from './request/site-company-create.request';
import { SiteCompanyGetListRequest } from './request/site-company-get-list.request';
import { SiteCompanyGetListResponse } from './response/site-company-get-list.response';
import { SiteCompanyService } from './site-company.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@ApiTags('[COMPANY] Site management')
@Controller('company/sites')
export class SiteCompanyController {
    constructor(private readonly siteCompanyService: SiteCompanyService) {}

    @ApiOperation({
        summary: 'Get list of sites',
        description: 'Company can get list for all created sites',
    })
    @ApiResponse({
        type: SiteCompanyGetListResponse,
        description: 'Get site successfully',
        status: HttpStatus.OK,
    })
    @Get()
    async getList(@Query() query: SiteCompanyGetListRequest): Promise<BaseResponse<SiteCompanyGetListResponse>> {
        const list = await this.siteCompanyService.getList(query);
        const total = await this.siteCompanyService.getTotal();
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @ApiOperation({
        summary: 'Create site',
        description: 'Company can create a new site',
    })
    @ApiResponse({
        type: BaseResponse,
        description: 'Create site successfully',
        status: HttpStatus.OK,
    })
    @Post()
    async createSite(
        @Body() body: SiteCompanyCreateRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        await this.siteCompanyService.createSite(body, request.user.accountId);
        return BaseResponse.ok();
    }

    @ApiOperation({
        summary: 'Delete site',
        description: 'Company can delete an existing site',
    })
    @ApiResponse({
        type: BaseResponse,
        description: 'Delete site successfully',
        status: HttpStatus.OK,
    })
    @ApiResponse({
        description: 'Site does not exist',
        status: HttpStatus.NOT_FOUND,
    })
    @Delete(':id')
    async deleteSite(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        await this.siteCompanyService.deleteSite(id);
        return BaseResponse.ok();
    }
}
