import { Body, Controller, Get, HttpStatus, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { MemberAdminService } from '../admin/member-admin.service';
import { MemberMemberService } from './member-member.service';
import { MemberMemberAddSiteOrPost } from './request/member-member-add-site.request';
import {
    UpsertBankAccountRequest,
    UpsertDisabilityRequest,
    UpsertForeignWorkerRequest,
    UpsertHSTCertificateRequest,
} from './request/member-member.request';
import { MemberMemebrUpdateInterestResponse } from './response/member-member-update-interest.response';
import { MemberDetailResponse } from './response/member-admin.response';

@ApiTags('[MEMBER] Member Management')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@Controller('member/members')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberMemberController {
    constructor(
        private readonly memberMemberService: MemberMemberService,
        private readonly memberAdminService: MemberAdminService,
    ) {}

    @Get('/details')
    @ApiOperation({
        summary: 'Find member detail',
        description: 'This endpoint retrieves member details in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: MemberDetailResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getMemberDetails(@Req() request: any): Promise<BaseResponse<MemberDetailResponse>> {
        return BaseResponse.of(await this.memberAdminService.getDetail(request.user.accountId));
    }

    @Put('/bank-account')
    @ApiOperation({
        summary: 'Upsert bank account',
        description: 'This endpoint upsert bank account in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async upsertBankAccount(@Req() request: any, @Body() bankAccount: UpsertBankAccountRequest): Promise<BaseResponse<null>> {
        await this.memberMemberService.upsertBankAccount(request.user.accountId, bankAccount);
        return BaseResponse.ok();
    }

    @Put('/hst-certificate')
    @ApiOperation({
        summary: 'Upsert Health and Safety Training Certificate',
        description: 'This endpoint upsert health and safety training certificate in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async upsertHSTCertificate(
        @Req() request: any,
        @Body() hstCertificate: UpsertHSTCertificateRequest,
    ): Promise<BaseResponse<null>> {
        await this.memberMemberService.upsertHSTCertificate(request.user.accountId, hstCertificate);
        return BaseResponse.ok();
    }

    @Put('/foreign-worker')
    @ApiOperation({
        summary: 'Upsert foreign worker detail',
        description: 'This endpoint upsert foreign worker in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async upsertForeignWorker(
        @Req() request: any,
        @Body() foreigWworker: UpsertForeignWorkerRequest,
    ): Promise<BaseResponse<null>> {
        await this.memberMemberService.upsertForeignWorker(request.user.accountId, foreigWworker);
        return BaseResponse.ok();
    }

    @Put('/disability')
    @ApiOperation({
        summary: 'Upsert disability detail',
        description: 'This endpoint upsert disability in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async upsertDisability(@Req() request: any, @Body() disability: UpsertDisabilityRequest): Promise<void> {
        await this.memberMemberService.upsertDisability(request.user.accountId, disability);
    }

    @Post('interest-site')
    @ApiOperation({
        summary: 'Add interest site',
        description: "This endpoint add a site to request's member interest list in the system.",
    })
    @ApiResponse({ status: HttpStatus.OK, type: MemberMemebrUpdateInterestResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async addInterestSite(
        @Req() request: any,
        @Body() payload: MemberMemberAddSiteOrPost,
    ): Promise<BaseResponse<MemberMemebrUpdateInterestResponse>> {
        return BaseResponse.of(await this.memberMemberService.updateInterestSite(request.user.accountId, payload));
    }

    @Post('interest-post')
    @ApiOperation({
        summary: 'Add interest post',
        description: "This endpoint add a post to request's member interest list in the system.",
    })
    @ApiResponse({ status: HttpStatus.OK, type: MemberMemebrUpdateInterestResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async addInterestPost(
        @Req() request: any,
        @Body() payload: MemberMemberAddSiteOrPost,
    ): Promise<BaseResponse<MemberMemebrUpdateInterestResponse>> {
        return BaseResponse.of(await this.memberMemberService.updateInterestPost(request.user.accountId, payload));
    }

    @Post('apply-post')
    @ApiOperation({
        summary: 'Apply a post',
        description: "This endpoint add a post to request's member apply list in the system.",
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async addApplyPost(@Req() request: any, @Body() payload: MemberMemberAddSiteOrPost): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.memberMemberService.addApplyPost(request.user.accountId, payload));
    }
}
