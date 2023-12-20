import { Controller, Get, HttpStatus, Param, ParseIntPipe, Put, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType, PostApplicationStatus, SupportCategory } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator.reponse';
import { ApplicationCompanyService } from './application-company.service';
import { ApplicationCompanyApplicantsSearch } from './dto/applicants/application-company-applicants-search.enum';
import { ApplicationCompanyGetListApplicantsRequest } from './request/application-company-get-list-applicants.request';
import {
    ApplicationCompanyGetListApplicantsItemResponse,
    ApplicationCompanyGetListApplicantsResponse,
} from './response/application-company-get-list-applicants.response';

@ApiTags('[COMPANY] Application Management')
@Controller('/company/applications')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class ApplicationCompanyController {
    constructor(private applicationCompanyService: ApplicationCompanyService) {}

    @Get('/:postId')
    @ApiOperation({
        summary: 'Listing post applicants',
        description: 'Company can search/filter post applicants',
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({
        name: 'searchCategory',
        type: String,
        required: false,
        description: 'Search by category: ' + Object.values(ApplicationCompanyApplicantsSearch),
    })
    @ApiQuery({ name: 'keyword', type: String, required: false, description: 'Key word for search catagories' })
    @ApiOkResponsePaginated(ApplicationCompanyGetListApplicantsItemResponse)
    async getListApplicantSite(
        @Param('postId', ParseIntPipe) postId: number,
        @Req() request: any,
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
    async proposeInteview(@Req() request: any, @Param('id', ParseIntPipe) applicationId: number): Promise<BaseResponse<void>> {
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
    async reject(@Req() request: any, @Param('id', ParseIntPipe) applicationId: number): Promise<BaseResponse<void>> {
        const posts = await this.applicationCompanyService.updateApplicationStatus(
            request.user.accountId,
            applicationId,
            PostApplicationStatus.REJECT_BY_COMPANY,
        );
        return BaseResponse.of(posts);
    }
}
