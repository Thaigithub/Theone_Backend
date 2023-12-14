import { Body, Controller, Delete, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { SiteCompanyService } from './site-company.service';
import { BaseResponse } from 'utils/generics/base.response';
import { SiteCompanyCreateRequest } from './request/site-company-create.request';
import { AccountIdExtensionRequest } from 'utils/generics/upsert-account.request';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@ApiTags('[COMPANY] Site management')
@Controller('company/sites')
export class SiteCompanyController {
    constructor(private readonly siteCompanyService: SiteCompanyService) {}

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
        body.startDate = `${body.startDate}T00:00:00Z`;
        body.endDate = `${body.endDate}T00:00:00Z`;
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
