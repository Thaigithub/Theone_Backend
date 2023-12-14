import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
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
import { SiteCompanyGetDetailResponse } from './response/site-company-get-detail.response';
import { SiteCompanyUpdateRequest } from './request/site-company-update.request';
import { SiteCompanyService } from './site-company.service';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@ApiTags('[COMPANY] Site management')
@Controller('company/sites')
export class SiteCompanyController {
    constructor(private readonly siteCompanyService: SiteCompanyService) {}

    @Get()
    @ApiOperation({
        summary: 'Get list of sites',
        description: 'Company can get list for all created sites',
    })
    @ApiResponse({
        type: SiteCompanyGetListResponse,
        description: 'Get site successfully',
        status: HttpStatus.OK,
    })
    async getList(@Query() query: SiteCompanyGetListRequest): Promise<BaseResponse<SiteCompanyGetListResponse>> {
        const list = await this.siteCompanyService.getList(query);
        const total = await this.siteCompanyService.getTotal();
        const paginationResponse = new PaginationResponse(list, new PageInfo(total));
        return BaseResponse.of(paginationResponse);
    }

    @Get(':id')
    @ApiOperation({
        summary: 'Get site detail',
        description: 'Company retrieve information of a site',
    })
    @ApiResponse({
        type: SiteCompanyGetDetailResponse,
        description: 'Get site information successfully',
        status: HttpStatus.OK,
    })
    @ApiResponse({
        description: 'Site does not exist',
        status: HttpStatus.NOT_FOUND,
    })
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<SiteCompanyGetDetailResponse>> {
        return BaseResponse.of(await this.siteCompanyService.getDetail(id));
    }

    @Post()
    @ApiOperation({
        summary: 'Create site',
        description: 'Company can create a new site',
    })
    @ApiResponse({
        type: BaseResponse,
        description: 'Create site successfully',
        status: HttpStatus.OK,
    })
    async createSite(
        @Body() body: SiteCompanyCreateRequest,
        @Req() request: AccountIdExtensionRequest,
    ): Promise<BaseResponse<void>> {
        await this.siteCompanyService.createSite(body, request.user.accountId);
        return BaseResponse.ok();
    }

    @Delete(':id')
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
    async deleteSite(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        await this.siteCompanyService.deleteSite(id);
        return BaseResponse.ok();
    }

    @Patch(':id')
    @ApiOperation({
        summary: 'Update site',
        description: 'Company change information of a site',
    })
    @ApiResponse({
        type: BaseResponse,
        description: 'Get site information successfully',
        status: HttpStatus.OK,
    })
    @ApiResponse({
        description: 'Site does not exist',
        status: HttpStatus.NOT_FOUND,
    })
    async updateSite(@Param('id', ParseIntPipe) id: number, @Body() body: SiteCompanyUpdateRequest): Promise<BaseResponse<void>> {
        await this.siteCompanyService.updateSite(id, body);
        return BaseResponse.ok();
    }
}
