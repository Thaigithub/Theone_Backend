import { Body, Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { PageInfo, PaginationResponse } from 'utils/generics/pageInfo.response';
import { MemberAdminService } from './member-admin.service';
import {
    ChangeMemberRequest,
    DownloadMembersRequest,
    DownloadSingleMemberRequest,
    GetMembersListRequest,
} from './request/member-admin.request';
import { MemberAdminGetDetailResponse } from './response/member-admin-get-detail.response';
import { MemberAdminGetListResponse } from './response/member-admin-get-list.response';

@ApiTags('[ADMIN] Member Management')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
@Controller('/admin/members')
export class MemberAdminController {
    constructor(private readonly memberAdminService: MemberAdminService) {}

    // Get members list by conditions
    @Get()
    @ApiOperation({
        summary: 'Listing members',
        description: 'Admin can search members by id, name, or can filter by membership level, account status',
    })
    @ApiResponse({
        type: MemberAdminGetListResponse,
        status: HttpStatus.OK,
    })
    async getList(@Query() query: GetMembersListRequest): Promise<BaseResponse<MemberAdminGetListResponse>> {
        const membersList = await this.memberAdminService.getList(query);
        const membersTotal = await this.memberAdminService.getTotal(query);
        const paginationResponse = new PaginationResponse(membersList, new PageInfo(membersTotal));
        return BaseResponse.of(paginationResponse);
    }

    // Download member list in excel file
    @Get('/download')
    @ApiOperation({
        summary: 'Download member in excel file',
        description: 'Admin can retrieve an excel file contains information of selected members',
    })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    @ApiQuery({
        name: 'memberId',
        isArray: true,
        type: 'number',
        example: [1, 2, 3],
    })
    async download(
        @Query() query: DownloadSingleMemberRequest | DownloadMembersRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<null>> {
        let memberIds = [];
        if (Array.isArray(query.memberId)) {
            memberIds = query.memberId.map((item) => parseInt(item));
        } else if (typeof query.memberId === 'string') memberIds = [parseInt(query.memberId)];
        await this.memberAdminService.download(memberIds, response);
        return BaseResponse.ok();
    }

    // Get member detail
    @Get('/:id')
    @ApiOperation({
        summary: 'Get member detail',
        description: 'Retrieve member information detail',
    })
    @ApiResponse({
        type: MemberAdminGetDetailResponse,
        description: 'Get member detail successfully',
        status: HttpStatus.OK,
    })
    @ApiResponse({
        description: 'Member does not exist',
        status: HttpStatus.NOT_FOUND,
    })
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<MemberAdminGetDetailResponse>> {
        return BaseResponse.of(await this.memberAdminService.getDetail(id));
    }

    // Change member information
    @Patch('/:id')
    @ApiOperation({
        summary: 'Change member information',
        description: 'Admin can change account_status of member or membership_level',
    })
    @ApiResponse({
        type: BaseResponse,
        description: 'Update member successfully',
        status: HttpStatus.OK,
    })
    @ApiResponse({
        description: 'Member does not exist',
        status: HttpStatus.NOT_FOUND,
    })
    async changeMemberInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() body: ChangeMemberRequest,
    ): Promise<BaseResponse<void>> {
        await this.memberAdminService.updateMember(id, body);
        return BaseResponse.ok();
    }
}
