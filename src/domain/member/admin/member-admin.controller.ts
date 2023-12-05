import { Controller, Get, HttpStatus, Param, ParseIntPipe, Patch, Query, Res, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { BaseResponse } from 'utils/generics/base.response';
import { MemberAdminService } from './member-admin.service';
import {
    ChangeMemberRequest,
    DownloadMembersRequest,
    DownloadSingleMemberRequest,
    GetMembersListRequest,
} from './request/member-admin.request';
import { GetMembersListResponse, MemberDetailResponse } from './response/member-admin.response';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountType } from '@prisma/client';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.ADMIN)
@Controller('admin/members')
@ApiTags('[ADMIN] Member Management')
export class MemberAdminController {
    constructor(private readonly memberAdminService: MemberAdminService) {}

    // Get members list by conditions
    @Get()
    @ApiOperation({
        summary: 'Listing members',
        description: 'Admin can search members by id, name, or can filter by membership level, account status',
    })
    @ApiResponse({
        type: GetMembersListResponse,
    })
    async getList(@Query() query: GetMembersListRequest): Promise<BaseResponse<GetMembersListResponse>> {
        const membersList = await this.memberAdminService.getList(query);
        const membersTotal = await this.memberAdminService.getTotal(query);
        const getMemberListResponse = new GetMembersListResponse(membersList, membersTotal);
        return BaseResponse.of(getMemberListResponse);
    }

    // Download member list in excel file
    @Get('download')
    @ApiOperation({
        summary: 'Download member in excel file',
        description: 'Admin can retrieve an excel file contains information of selected members',
    })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    async download(
        @Query() query: DownloadSingleMemberRequest | DownloadMembersRequest,
        @Res() response: Response,
    ): Promise<BaseResponse<null>> {
        let memberIds = [];
        if (Array.isArray(query.memberIds)) {
            memberIds = query.memberIds.map((item) => parseInt(item));
        } else if (typeof query.memberIds === 'string') memberIds = [parseInt(query.memberIds)];
        await this.memberAdminService.download(memberIds, response);
        return BaseResponse.ok();
    }

    // Get member detail
    @Get(':id')
    @ApiOperation({
        summary: 'Get member detail',
        description: 'Retrieve member information detail',
    })
    @ApiResponse({
        type: GetMembersListResponse,
    })
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<MemberDetailResponse>> {
        return BaseResponse.of(await this.memberAdminService.getDetail(id));
    }

    // Change member information
    @Patch(':id')
    @ApiOperation({
        summary: 'Change member information',
        description: 'Admin can change account_status of member or membership_level',
    })
    @ApiResponse({
        status: HttpStatus.OK,
    })
    async changeMemberInfo(
        @Param('id', ParseIntPipe) id: number,
        @Query() payload: ChangeMemberRequest,
    ): Promise<BaseResponse<null>> {
        await this.memberAdminService.updateMember(id, payload);
        return BaseResponse.ok();
    }
}
