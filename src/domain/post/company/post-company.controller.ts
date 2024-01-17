import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { PostCompanyService } from './post-company.service';
import { PostCompanyCreateHeadhuntingRequestRequest } from './request/post-company-create-headhunting-request.request';
import { PostCompanyCreateRequest } from './request/post-company-create.request';
import { PostCompanyGetListApplicantSiteRequest } from './request/post-company-get-list-applicant-site.request';
import { PostCompanyGetListRequest } from './request/post-company-get-list.request';
import { PostCompanyHeadhuntingRequestRequest } from './request/post-company-headhunting-request.request';
import { PostCompanyDetailResponse } from './response/post-company-detail.response';
import { PostCompanyCountPostsResponse } from './response/post-company-get-count-post.response';
import { PostCompanyGetListApplicantsResponse } from './response/post-company-get-list-applicants.response';
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
        @Req() req: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) siteId: number,
    ): Promise<BaseResponse<PostCompanyGetListBySite>> {
        return BaseResponse.of(await this.postCompanyService.getListSite(req.user.accountId, siteId));
    }

    @Post('/:id/headhunting-request')
    async createHeadhuntingRequest(
        @Req() request: AccountIdExtensionRequest,
        @Body() body: PostCompanyCreateHeadhuntingRequestRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<void>> {
        await this.postCompanyService.createHeadhuntingRequest(request.user.accountId, body, id);
        return BaseResponse.ok();
    }
    @Get('/headhunting-request')
    async getListHeadhuntingRequest(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: PostCompanyHeadhuntingRequestRequest,
    ): Promise<BaseResponse<PostCompanyGetListHeadhuntingRequestResponse>> {
        const posts = await this.postCompanyService.getListHeadhuntingRequest(request.user.accountId, query);
        return BaseResponse.of(posts);
    }

    @Get('/applicant-site')
    async getListApplicant(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: PostCompanyGetListApplicantSiteRequest,
    ): Promise<BaseResponse<PostCompanyGetListApplicantsResponse>> {
        const posts = await this.postCompanyService.getListApplicant(request.user.accountId, query);
        return BaseResponse.of(posts);
    }

    @Get('/count')
    async count(@Req() req: AccountIdExtensionRequest): Promise<BaseResponse<PostCompanyCountPostsResponse>> {
        return BaseResponse.of(await this.postCompanyService.count(req.user.accountId));
    }

    @Get('/:id')
    async getDetail(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
    ): Promise<BaseResponse<PostCompanyDetailResponse>> {
        return BaseResponse.of(await this.postCompanyService.getDetail(request.user.accountId, id));
    }

    @Patch('/:id')
    async update(
        @Req() request: AccountIdExtensionRequest,
        @Param('id', ParseIntPipe) id: number,
        @Body() payload: PostCompanyCreateRequest,
    ): Promise<BaseResponse<void>> {
        await this.postCompanyService.update(request.user.accountId, id, payload);
        return BaseResponse.ok();
    }

    @Delete('/:id')
    async delete(@Req() request: AccountIdExtensionRequest, @Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.postCompanyService.delete(request.user.accountId, id));
    }

    @Get()
    async getList(
        @Req() request: AccountIdExtensionRequest,
        @Query() query: PostCompanyGetListRequest,
    ): Promise<BaseResponse<PostCompanyGetListResponse>> {
        const posts = await this.postCompanyService.getList(request.user.accountId, query);
        return BaseResponse.of(posts);
    }

    @Post()
    async create(
        @Req() userRequest: AccountIdExtensionRequest,
        @Body() request: PostCompanyCreateRequest,
    ): Promise<BaseResponse<void>> {
        await this.postCompanyService.create(userRequest.user.accountId, request);
        return BaseResponse.ok();
    }
}
