import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApplicationMemberService } from './application-member.service';
import { ApplicationMemberGetListRequest } from './request/application-member-get-list.request';
import { ApplicationMemberGetListResponse } from './response/application-member-get-list.response';

@ApiTags('[MEMBER] Application Management')
@Controller('/member/applications')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class ApplicationMemberController {
    constructor(private applicationMemberService: ApplicationMemberService) {}

    @Get()
    @ApiOperation({
        summary: 'Listing post applied',
        description: 'Member can search/filter post applied',
    })
    @ApiResponse({})
    async getApplicationList(
        @Req() request: any,
        @Query() query: ApplicationMemberGetListRequest,
    ): Promise<BaseResponse<ApplicationMemberGetListResponse>> {
        return BaseResponse.of(await this.applicationMemberService.getApplicationList(request.user.accountId, query));
    }
}
