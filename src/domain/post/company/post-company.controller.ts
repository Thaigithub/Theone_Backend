import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PostCompanyService } from './post-company.service';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListApplicantSiteRequest } from './request/post-company-get-list-applicant-site.request';
import { PostCompanyGetListHeadhuntingRequest } from './request/post-company-get-list-headhunting.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyUpdatePullUpStatusRequest } from './request/post-company-update-pull-up-status.request';
import { PostCompanyUpdateTypeRequest } from './request/post-company-update-type.request';
import { PostCompanyCheckPullUpAvailabilityResponse } from './response/post-company-check-pull-up-availability.response';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
import { PostCompanyCountPostsResponse } from './response/post-company-get-count-post.response';
import { PostCompanyGetListApplicationResponse } from './response/post-company-get-list-application.response';
import { PostCompanyGetListBySite } from './response/post-company-get-list-by-site.response';
import { PostCompanyGetListHeadhuntingRequestResponse } from './response/post-company-get-list-headhunting-request.response';
import { PostCompanyGetListResponse } from './response/post-company-get-list.response';

@Controller('/company/posts')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class PostCompanyController {
    constructor(private postCompanyService: PostCompanyService) {}

    @Get('/site/:id')
    async getListSite(
        @Req() req: BaseRequest,
        @Param('id', ParseIntPipe) siteId: number,
    ): Promise<BaseResponse<PostCompanyGetListBySite>> {
        return BaseResponse.of(await this.postCompanyService.getListSite(req.user.accountId, siteId));
    }

    @Get('/headhunting')
    async getListHeadhunting(
        @Req() request: BaseRequest,
        @Query() query: PostCompanyGetListHeadhuntingRequest,
    ): Promise<BaseResponse<PostCompanyGetListHeadhuntingRequestResponse>> {
        return BaseResponse.of(await this.postCompanyService.getListHeadhunting(request.user.accountId, query));
    }

    @Get('/application')
    async getListApplication(
        @Req() request: BaseRequest,
        @Query() query: PostCompanyGetListApplicantSiteRequest,
    ): Promise<BaseResponse<PostCompanyGetListApplicationResponse>> {
        return BaseResponse.of(await this.postCompanyService.getListApplication(request.user.accountId, query));
    }

    @Get('/count')
    async count(@Req() req: BaseRequest): Promise<BaseResponse<PostCompanyCountPostsResponse>> {
        return BaseResponse.of(await this.postCompanyService.count(req.user.accountId));
    }

    @Get('/:id')
    async getDetail(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<PostCompanyDetailResponse>> {
        return BaseResponse.of(await this.postCompanyService.getDetail(request.user.accountId, id));
    }

    @Patch('/:id')
    async update(
        @Req() request: BaseRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: PostCompanyCreateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postCompanyService.update(request.user.accountId, id, payload));
    }

    @Delete('/:id')
    async delete(@Req() request: BaseRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postCompanyService.delete(request.user.accountId, id));
    }

    @Get()
    async getList(
        @Req() request: BaseRequest,
        @Query() query: PostCompanyGetListRequest,
    ): Promise<BaseResponse<PostCompanyGetListResponse>> {
        return BaseResponse.of(await this.postCompanyService.getList(request.user.accountId, query));
    }

    @Post()
    async create(@Req() userRequest: BaseRequest, @Body() request: PostCompanyCreateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postCompanyService.create(userRequest.user.accountId, request));
    }

    @Get('/:id/pullup/availability')
    async checkPullUpAvailability(
        @Param('id', ParseIntPipe) postId: number,
        @Req() request: BaseRequest,
    ): Promise<BaseResponse<PostCompanyCheckPullUpAvailabilityResponse>> {
        return BaseResponse.of(await this.postCompanyService.checkPullUpAvailability(postId, request.user.accountId));
    }

    @Patch('/:id/pullup')
    async updatePullUpStatus(
        @Param('id', ParseIntPipe) postId: number,
        @Req() request: BaseRequest,
        @Body() body: PostCompanyUpdatePullUpStatusRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postCompanyService.updatePullUpStatus(postId, request.user.accountId, body));
    }

    @Patch('/:id/type')
    async updateType(
        @Param('id', ParseIntPipe) postId: number,
        @Req() request: BaseRequest,
        @Body() body: PostCompanyUpdateTypeRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postCompanyService.updateType(postId, request.user.accountId, body));
    }
}
