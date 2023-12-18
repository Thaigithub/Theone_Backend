import { Controller, HttpStatus, Param, ParseIntPipe, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { SiteMemberUpdateInterestResponse } from './response/site-member-update-interest.response';
import { SiteMemberService } from './site-member.service';

@ApiTags('[MEMBER] Sites Management')
@Controller('/member/sites')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class PostMemberController {
    constructor(private siteMemberService: SiteMemberService) {}
    @Post('/:id/interest')
    @ApiOperation({
        summary: 'Add interest site',
        description: "This endpoint add a site to request's member interest list in the system.",
    })
    @ApiResponse({ status: HttpStatus.OK, type: SiteMemberUpdateInterestResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async addInterestSite(
        @Req() request: any,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<SiteMemberUpdateInterestResponse>> {
        return BaseResponse.of(await this.siteMemberService.updateInterestSite(request.user.accountId, id));
    }
}
