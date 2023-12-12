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
import { ApiConsumes, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { ApiOkResponsePaginated } from 'utils/generics/pagination.decorator.reponse';
import { PostCompanyService } from './post-company.service';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListApplicantSiteRequest } from './request/post-company-get-list-applicant-site.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
import { PostCompanyGetItemListResponse } from './response/post-company-get-item-list.response';
import { PostCompanyGetListResponse } from './response/post-company-get-list.response';

@ApiTags('[COMPANY] Posts Management')
@Controller('/company/posts')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class PostCompanyController {
    constructor(private postCompanyService: PostCompanyService) {}

    @Get('/applicant-site')
    @ApiOperation({
        summary: 'Listing post applicants general',
        description: 'Company can search/filter post applicants general',
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({ name: 'startDate', type: Date, required: false, description: 'Start date period of post' })
    @ApiQuery({ name: 'endDate', type: Date, required: false, description: 'End date period of post' })
    @ApiQuery({ name: 'category', type: String, required: false, description: 'Search by category: POST_NAME, SITE_NAME' })
    @ApiQuery({ name: 'keyword', type: String, required: false, description: 'Key word for search catagories' })
    @ApiQuery({ name: 'type', type: String, required: false, description: 'Type for search: COMMON, PREMIUM' })
    @ApiOkResponsePaginated(PostCompanyGetItemListResponse)
    async getListApplicantSite(
        @Req() request: any,
        @Query() query: PostCompanyGetListApplicantSiteRequest,
    ): Promise<BaseResponse<PostCompanyGetListResponse>> {
        const posts = await this.postCompanyService.getListApplicantSite(request.user.accountId, query);
        return BaseResponse.of(posts);
    }

    // Get members list by conditions
    @Get()
    @ApiOperation({
        summary: 'Listing post',
        description: 'Company can search post',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: "The company's post list retrieved successfully",
        type: PostCompanyGetListResponse,
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({ name: 'name', type: String, required: false, description: 'Search by job post title' })
    @ApiQuery({ name: 'type', type: String, required: false, description: 'Type for search: COMMON, PREMIUM' })
    @ApiQuery({
        name: 'status',
        type: String,
        required: false,
        description: 'Status for search: ALL,PREPARE,RECRUITING,DEADLINE',
    })
    async getList(
        @Req() request: any,
        @Query() query: PostCompanyGetListRequest,
    ): Promise<BaseResponse<PostCompanyGetListResponse>> {
        const posts = await this.postCompanyService.getList(request.user.accountId, query);
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

    @Get(':id')
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
    @Patch(':id')
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

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete post',
        description: 'Company can delete a job post',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async deletePost(@Req() request: any, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postCompanyService.deletePost(request.user.accountId, id));
    }
}
