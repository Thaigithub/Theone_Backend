import { Controller, Get, HttpStatus, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { ApplicationCompanyGetMemberDetail } from 'domain/application/company/response/application-company-get-member-detail.response';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { MemberCompanyService } from './member-company.service';

@ApiTags('[COMPANY] Member Management')
@Controller('/company/members')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberCompanyController {
    constructor(private memberCompanyService: MemberCompanyService) {}

    @Get(':id/applicants')
    @ApiOperation({
        summary: 'Post detail',
        description: 'Retrieve post information detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: ApplicationCompanyGetMemberDetail,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getMemberDetail(
        @Req() request: any,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ApplicationCompanyGetMemberDetail>> {
        return BaseResponse.of(await this.memberCompanyService.getMemberDetail(request.user.accountId, id));
    }
}
