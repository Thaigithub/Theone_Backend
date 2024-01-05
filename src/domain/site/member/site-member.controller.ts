import { Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { SiteMemberGetListRequest } from './request/site-member-get-list.request';
import { SiteMemberGetDetailResponse } from './response/site-member-get-detail.response';
import { SiteMemberGetListResponse } from './response/site-member-get-list.response';
import { SiteMemberUpdateInterestResponse } from './response/site-member-update-interest.response';
import { SiteMemberService } from './site-member.service';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';

@ApiTags('[MEMBER] Sites Management')
@Controller('/member/sites')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class SiteMemberController {
    constructor(private siteMemberService: SiteMemberService) {}
    @Post('/:id/interest')
    @ApiOperation({
        summary: 'Add interest site',
        description: "This endpoint add a site to request's member interest list in the system.",
    })
    @ApiResponse({ status: HttpStatus.OK, type: SiteMemberUpdateInterestResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async addInterestSite(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<SiteMemberUpdateInterestResponse>> {
        return BaseResponse.of(await this.siteMemberService.updateInterestSite(request.user.accountId, id));
    }

    @Get()
    @ApiOperation({
        summary: 'Listing/Searching/Filtering Site List',
        description: 'Listing Site List optionally by condition',
    })
    @ApiQuery({ name: 'name', type: 'string', required: false, description: 'Site name' })
    @ApiQuery({ name: 'addressCity', type: 'string', required: false, description: 'Address city of site' })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiResponse({ status: HttpStatus.OK, type: SiteMemberGetListResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getSites(@Query() query: SiteMemberGetListRequest): Promise<BaseResponse<SiteMemberGetListResponse>> {
        return BaseResponse.of(await this.siteMemberService.getSiteList(query));
    }

    @Get('/:id')
    @ApiOperation({
        summary: 'Site detail',
        description: 'Retrieve detail information of a site',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: SiteMemberGetDetailResponse,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getDetail(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<SiteMemberGetDetailResponse>> {
        return BaseResponse.of(await this.siteMemberService.getSiteDetail(request.user.accountId, id));
    }
}
