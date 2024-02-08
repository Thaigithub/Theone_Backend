import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { ApplicationCompanyService } from './application-company.service';
import { ApplicationCompanyGetListPostRequest } from './request/application-company-get-list-post.request';
import { ApplicationCompanyUpdateStatusRequest } from './request/application-company-update-status.request';
import { ApplicationCompanyGetDetailMemberResponse } from './response/application-company-get-detail-member.response';
import { ApplicationCompanyGetDetailTeamResponse } from './response/application-company-get-detail-team.response';
import { ApplicationCompanyGetListOfferPost } from './response/application-company-get-list-offer-post.response';
import { ApplicationCompanyGetListPostResponse } from './response/application-company-get-list-post.response';
import { ApplicationCompanyGetTotalResponse } from './response/application-company-get-total.response';

@Controller('/company/applications')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ApplicationCompanyController {
    constructor(private applicationCompanyService: ApplicationCompanyService) {}

    @Get('/offer/post/:postId')
    async getListOfferPost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: BaseRequest,
    ): Promise<BaseResponse<ApplicationCompanyGetListOfferPost>> {
        return BaseResponse.of(await this.applicationCompanyService.getListOfferPost(req.user.accountId, postId));
    }

    @Get('/count')
    async count(@Req() req: BaseRequest): Promise<BaseResponse<ApplicationCompanyGetTotalResponse>> {
        return BaseResponse.of(await this.applicationCompanyService.count(req.user.accountId));
    }

    @Get('/post/:postId')
    async getListPost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() request: BaseRequest,
        @Query() query: ApplicationCompanyGetListPostRequest,
    ): Promise<BaseResponse<ApplicationCompanyGetListPostResponse>> {
        return BaseResponse.of(await this.applicationCompanyService.getListPost(request.user.accountId, query, postId));
    }

    @Get('/:id/member')
    async getDetailMember(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ApplicationCompanyGetDetailMemberResponse>> {
        return BaseResponse.of(await this.applicationCompanyService.getDetailMember(request.user.accountId, id));
    }

    @Get('/:id/team')
    async getDetailTeam(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<ApplicationCompanyGetDetailTeamResponse>> {
        return BaseResponse.of(await this.applicationCompanyService.getDetailTeam(request.user.accountId, id));
    }

    @Get('/:id/team/member/:memberId')
    async getDetailTeamMember(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Param('memberId', ParseIntPipe) memberId: number,
    ): Promise<BaseResponse<ApplicationCompanyGetDetailMemberResponse>> {
        return BaseResponse.of(await this.applicationCompanyService.getDetailTeamMember(request.user.accountId, id, memberId));
    }

    @Patch('/:id/status')
    async updateStatus(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) applicationId: number,
        @Body() body: ApplicationCompanyUpdateStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.applicationCompanyService.updateStatus(request.user.accountId, applicationId, body));
    }
}
