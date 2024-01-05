import { Body, Controller, Get, Param, ParseIntPipe, Patch, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { ApplicationCompanyService } from './application-company.service';
import { ApplicationCompanyGetListApplicantsRequest } from './request/application-company-get-list-applicants.request';
import { ApplicationCompanyUpdateStatusRequest } from './request/application-company-update-status.request';
import { ApplicationCompanyCountApplicationsResponse } from './response/application-company-count-applicants.response';
import { ApplicationCompanyGetListApplicantsResponse } from './response/application-company-get-list-applicants.response';
import { ApplicationCompanyGetListOfferByPost } from './response/application-company-get-list-offer-by-post.response';

@Controller('/company/applications')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class ApplicationCompanyController {
    constructor(private applicationCompanyService: ApplicationCompanyService) {}
    @Get('/offer/post/:postId')
    async getListOfferForPost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() req: AccountIdExtensionRequest,
    ): Promise<BaseResponse<ApplicationCompanyGetListOfferByPost>> {
        return BaseResponse.of(await this.applicationCompanyService.getListOfferForPost(req.user.accountId, postId));
    }

    @Get('/count')
    async count(@Req() req: AccountIdExtensionRequest): Promise<BaseResponse<ApplicationCompanyCountApplicationsResponse>> {
        return BaseResponse.of(await this.applicationCompanyService.count(req.user.accountId));
    }

    @Get('/post/:postId')
    async getListForPost(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() request: AccountIdExtensionRequest,
        @Query() query: ApplicationCompanyGetListApplicantsRequest,
    ): Promise<BaseResponse<ApplicationCompanyGetListApplicantsResponse>> {
        return BaseResponse.of(await this.applicationCompanyService.getListForPost(request.user.accountId, query, postId));
    }

    @Patch('/:id/status')
    async proposeInteview(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) applicationId: number,
        @Body() body: ApplicationCompanyUpdateStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.applicationCompanyService.updateStatus(request.user.accountId, applicationId, body));
    }
}
