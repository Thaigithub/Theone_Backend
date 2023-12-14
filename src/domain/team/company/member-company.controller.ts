import { Controller, Get, HttpStatus, Param, ParseIntPipe, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { CompanyTeamService } from './member-company.service';
import { TeamCompanyGetTeamDetailApplicants } from './response/team-company-get-team-detail.response';

@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Roles(AccountType.COMPANY)
@ApiBearerAuth()
@Controller('company/team')
@ApiTags('[COMPANY] Team Management')
export class CompanyTeamController {
    constructor(private readonly companyTeamService: CompanyTeamService) {}

    @Get(':id/applicants')
    @ApiOperation({
        summary: 'Post detail',
        description: 'Retrieve post information detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: TeamCompanyGetTeamDetailApplicants,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getTeamDetail(
        @Req() request: any,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<TeamCompanyGetTeamDetailApplicants>> {
        return BaseResponse.of(await this.companyTeamService.getTeamDetail(request.user.accountId, id));
    }
}
