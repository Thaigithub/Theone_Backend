import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Req,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator.reponse';
import { PostCompanyHeadhuntingRequestFilter } from './enum/post-company-headhunting-request-filter.enum';
import { PostCompanyService } from './post-company.service';
import { PostCompanyCreateHeadhuntingRequestRequest } from './request/post-company-create-headhunting-request.request';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListApplicantSiteRequest } from './request/post-company-get-list-applicant-site.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyHeadhuntingRequestRequest } from './request/post-company-headhunting-request.request';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
import { PostCompanyGetItemApplicantsResponse } from './response/post-company-get-item-applicants.response';
import { PostCompanyGetListApplicantsResponse } from './response/post-company-get-list-applicants.response';
import {
    PostCompanyGetItemHeadhuntingRequestResponse,
    PostCompanyGetListHeadhuntingRequestResponse,
} from './response/post-company-get-list-headhunting-request.response';
import { PostCompanyGetListResponse } from './response/post-company-get-list.response';
import { PostCompanyGetItemListResponse } from './response/post-company-get-item-list.response';

@ApiTags('[COMPANY] Posts Management')
@Controller('/company/posts')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class PostCompanyController {
    constructor(private postCompanyService: PostCompanyService) {}

    @Post('/:id/headhunting-request')
    @ApiOperation({
        summary: 'Create a request of Headhunting post',
        description: 'This endpoint creates a request of a Headhunting post in the system',
    })
    @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async createHeadhuntingRequest(
        @Req() request: any,
        @Body() body: PostCompanyCreateHeadhuntingRequestRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        await this.postCompanyService.createHeadhuntingRequest(request.user.accountId, body, id);
        return BaseResponse.ok();
    }
    @Get('/headhunting-request')
    @ApiOperation({
        summary: 'Listing headhunting for request post',
        description: 'Company can list/filter/search all headhunting posts for request to admin',
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({
        name: 'category',
        type: String,
        required: false,
        description: 'Search by category:' + Object.values(PostCompanyHeadhuntingRequestFilter),
    })
    @ApiQuery({ name: 'keyword', type: String, required: false, description: 'Keyword for category search' })
    @ApiOkResponsePaginated(PostCompanyGetItemHeadhuntingRequestResponse)
    async getListHeadhuntingRequest(
        @Req() request: any,
        @Query() query: PostCompanyHeadhuntingRequestRequest,
    ): Promise<BaseResponse<PostCompanyGetListHeadhuntingRequestResponse>> {
        const posts = await this.postCompanyService.getListHeadhuntingRequest(request.user.accountId, query);
        return BaseResponse.of(posts);
    }

    @Get('/applicant-site')
    @ApiOperation({
        summary: 'Listing post to show applicants',
        description: 'Company can search/filter post to show applicants',
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({ name: 'startDate', type: Date, required: false, description: 'Start date period of post' })
    @ApiQuery({ name: 'endDate', type: Date, required: false, description: 'End date period of post' })
    @ApiQuery({ name: 'category', type: String, required: false, description: 'Search by category: POST_NAME, SITE_NAME' })
    @ApiQuery({ name: 'keyword', type: String, required: false, description: 'Key word for search catagories' })
    @ApiQuery({ name: 'type', type: String, required: false, description: 'Type for search: COMMON, PREMIUM' })
    @ApiOkResponsePaginated(PostCompanyGetItemApplicantsResponse)
    async getListApplicantSite(
        @Req() request: any,
        @Query() query: PostCompanyGetListApplicantSiteRequest,
    ): Promise<BaseResponse<PostCompanyGetListApplicantsResponse>> {
        const posts = await this.postCompanyService.getListApplicantSite(request.user.accountId, query);
        return BaseResponse.of(posts);
    }

    @Post('/create')
    @ApiOperation({
        summary: 'Create post',
        description: 'This endpoint creates a post of a company in the system',
    })
    @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async create(@Req() userRequest: any, @Body() request: PostCompanyCreateRequest): Promise<BaseResponse<void>> {
        await this.postCompanyService.create(userRequest.user.accountId, request);
        return BaseResponse.ok();
    }

    @Get('/:id')
    @ApiOperation({
        summary: 'Post detail',
        description: 'Retrieve post information detail',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        type: PostCompanyDetailResponse,
    })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: BaseResponse })
    async getDetail(
        @Req() request: any,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<PostCompanyDetailResponse>> {
        return BaseResponse.of(await this.postCompanyService.getPostDetails(request.user.accountId, id));
    }

    // Change admin information
    @Patch('/:id')
    @ApiOperation({
        summary: 'Change post information',
        description: 'Company change post information',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async changePageInfo(
        @Req() request: any,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: PostCompanyCreateRequest,
    ): Promise<BaseResponse<void>> {
        await this.postCompanyService.changePostInfo(request.user.accountId, id, payload);
        return BaseResponse.ok();
    }

    @Delete('/:id')
    @ApiOperation({
        summary: 'Delete post',
        description: 'Company can delete a job post',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async deletePost(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postCompanyService.deletePost(request.user.accountId, id));
    }

    @Get()
    @ApiOperation({
        summary: 'Listing post',
        description: 'Company can search post',
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({ name: 'name', type: String, required: false, description: 'Search by job post title' })
    @ApiQuery({ name: 'type', type: String, required: false, description: 'Type for search: COMMON, PREMIUM' })
    @ApiQuery({
        name: 'status',
        type: String,
        required: false,
        description: 'Status for search: PREPARE,RECRUITING,DEADLINE',
    })
    @ApiOkResponsePaginated(PostCompanyGetItemListResponse)
    async getList(
        @Req() request: any,
        @Query() query: PostCompanyGetListRequest,
    ): Promise<BaseResponse<PostCompanyGetListResponse>> {
        const posts = await this.postCompanyService.getList(request.user.accountId, query);
        return BaseResponse.of(posts);
    }
}
