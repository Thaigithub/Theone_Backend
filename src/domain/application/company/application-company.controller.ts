import { Controller, Get, HttpStatus, Param, ParseIntPipe, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType, PostApplicationStatus, SupportCategory } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApplicationCompanyService } from './application-company.service';
import { ApplicationCompanyGetListApplicantsRequest } from './request/application-company-get-list-applicants.request';
import { ApplicationCompanyCountApplicationsResponse } from './response/application-company-count-applicants.response';
import { ApplicationCompanyGetListApplicantsResponse } from './response/application-company-get-list-applicants.response';
import { ApplicationCompanyGetListOfferByPost } from './response/application-company-get-list-offer-by-post.response';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';

@ApiTags('[COMPANY] Application Management')
@Controller('/company/applications')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class ApplicationCompanyController {
    constructor(private applicationCompanyService: ApplicationCompanyService) {}
    @Get('/offer-by-post/:id')
    async getApplicationOfferByPost(
        @Param('id', ParseIntPipe) postId: number,
        @Req() req: AccountIdExtensionRequest,
    ): Promise<BaseResponse<ApplicationCompanyGetListOfferByPost>> {
        return BaseResponse.of(await this.applicationCompanyService.getListOfferByPost(req.user.accountId, postId));
    }

    @Get('/count')
    @ApiOperation({
        summary: 'count all applications that is active in your company (use for dashboard)',
        description: 'Company retrieve the total number of applications that is active',
    })
    @ApiResponse({ status: HttpStatus.ACCEPTED, type: ApplicationCompanyCountApplicationsResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'The company account does not exist', type: BaseResponse })
    async countApplications(
        @Req() req: AccountIdExtensionRequest,
    ): Promise<BaseResponse<ApplicationCompanyCountApplicationsResponse>> {
        return BaseResponse.of(await this.applicationCompanyService.countApplications(req.user.accountId));
    }

    @Get('/:postId')
    @ApiOperation({
        summary: 'Listing post applicants',
        description: 'Company can search/filter post applicants',
    })
    async getListApplicantSite(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() request: AccountIdExtensionRequest,
        @Query() query: ApplicationCompanyGetListApplicantsRequest,
    ): Promise<BaseResponse<ApplicationCompanyGetListApplicantsResponse>> {
        const posts = await this.applicationCompanyService.getListApplicant(request.user.accountId, query, postId);
        return BaseResponse.of(posts);
    }

    @Put('/:id/propose')
    @ApiOperation({
        summary: 'Propose a job interview',
        description: 'Company can propose a job interview',
    })
    @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async proposeInteview(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) applicationId: number,
    ): Promise<BaseResponse<void>> {
        const posts = await this.applicationCompanyService.proposeInterview(
            request.user.accountId,
            applicationId,
            SupportCategory.MANPOWER,
        );
        return BaseResponse.of(posts);
    }

    @Put('/:id/reject')
    @ApiOperation({
        summary: 'Reject a post application',
        description: 'Company can reject a post application',
    })
    @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async reject(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) applicationId: number,
    ): Promise<BaseResponse<void>> {
        const posts = await this.applicationCompanyService.updateApplicationStatus(
            request.user.accountId,
            applicationId,
            PostApplicationStatus.REJECT_BY_COMPANY,
        );
        return BaseResponse.of(posts);
    }
}
