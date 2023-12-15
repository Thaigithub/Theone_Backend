import { Controller, Get, HttpStatus, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApplicationMemberService } from './application-member.service';
import { ApplicationMemberGetListRequest } from './request/application-member-get-list.request';
import { ApplicationMemberGetDetailResponse } from './response/application-member-get-detail.response';
import { ApplicationMemberGetListResponse } from './response/application-member-get-list.response';

@ApiTags('[MEMBER] Application Management')
@Controller('/member/applications')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
@ApiBearerAuth()
export class ApplicationMemberController {
    constructor(private applicationMemberService: ApplicationMemberService) {}

    @Get()
    @ApiOperation({
        summary: 'Listing post applied',
        description: 'Member can search/filter post applied',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ApplicationMemberGetListResponse,
    })
    async getApplicationList(
        @Req() request: any,
        @Query() query: ApplicationMemberGetListRequest,
    ): Promise<BaseResponse<ApplicationMemberGetListResponse>> {
        return BaseResponse.of(await this.applicationMemberService.getApplicationList(request.user.accountId, query));
    }

    @Get('/:id')
    @ApiOperation({
        summary: 'Listing post applied',
        description: 'Member can search/filter post applied',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ApplicationMemberGetDetailResponse,
    })
    @ApiResponse({
        status: HttpStatus.NOT_FOUND,
        type: BaseResponse,
    })
    async getDetailApplication(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: any,
    ): Promise<BaseResponse<ApplicationMemberGetDetailResponse>> {
        return BaseResponse.of(await this.applicationMemberService.getDetailApplication(id, req.user.accountId));
    }
}
