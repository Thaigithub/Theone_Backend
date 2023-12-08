import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { PostCompanyService } from './post-company.service';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
import { PostCompanyGetListResponse } from './response/post-company-get-list.response';

@ApiTags('[COMPANY] Posts Management')
@Controller('/company/posts')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class PostCompanyController {
    constructor(private postCompanyService: PostCompanyService) {}

    // Get members list by conditions
    @Get()
    @ApiOperation({
        summary: 'Listing administrator',
        description: 'Admin can search admins by id, name, or can filter by level',
    })
    @ApiResponse({
        status: HttpStatus.OK,
        description: 'The admin list retrieved successfully',
        type: PostCompanyGetListResponse,
    })
    @ApiQuery({ name: 'pageNumber', type: Number, required: false, description: 'Page number' })
    @ApiQuery({ name: 'pageSize', type: Number, required: false, description: 'Items per page' })
    @ApiQuery({ name: 'name', type: String, required: false, description: 'Search by job post title' })
    @ApiQuery({ name: 'type', type: String, required: false, description: 'Type for search: ALL, COMMON, PREMIUM' })
    @ApiQuery({
        name: 'status',
        type: String,
        required: false,
        description: 'Status for search: ALL,PREPARE,RECRUITING,DEADLINE',
    })
    async getList(@Query() query: PostCompanyGetListRequest): Promise<BaseResponse<PostCompanyGetListResponse>> {
        const posts = await this.postCompanyService.getList(query);
        return BaseResponse.of(posts);
    }

    @Post('/create')
    @ApiOperation({
        summary: 'Create post',
        description: 'This endpoint creates a post of a company in the system',
    })
    @ApiResponse({ status: HttpStatus.CREATED, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async create(@Body() request: PostCompanyCreateRequest): Promise<BaseResponse<void>> {
        await this.postCompanyService.create(request);
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
    async getDetail(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<PostCompanyDetailResponse>> {
        return BaseResponse.of(await this.postCompanyService.getPostDetails(id));
    }

    // Change admin information
    @Patch(':id')
    @ApiOperation({
        summary: 'Change post information',
        description: 'Company change post information',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async changePageInfo(
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: PostCompanyCreateRequest,
    ): Promise<BaseResponse<void>> {
        await this.postCompanyService.changePostInfo(id, payload);
        return BaseResponse.ok();
    }

    @Delete(':id')
    @ApiOperation({
        summary: 'Delete post',
        description: 'Company can delete a job post',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    async deletePost(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postCompanyService.deletePost(id));
    }
}
