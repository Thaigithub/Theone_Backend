import { Body, Controller, Get, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponse } from 'utils/generics/base.response';
import { AccountMemberService } from './account-member.service';
import { MemberAccountSignupRequest } from './request/account-member-signup.request';
import { MemberAccountSignupSnsRequest } from './request/account-member-signup.request-sns';
import { UpsertBankAccountRequest } from './request/account-member-upsert-bankaccount.request';
import { UpsertDisabilityRequest } from './request/account-member-upsert-disability.request';
import { UpsertForeignWorkerRequest } from './request/account-member-upsert-foreignworker.request';
import { UpsertHSTCertificateRequest } from './request/account-member-upsert-hstcertificate.request';
import { AccountMemberCheckUsernameExistenceResponse } from './response/account-member-check-exist-accountId.response';
import { MemberDetailResponse } from './response/account-member-get-detail.response';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';

@ApiTags('[MEMBER] Accounts Management')
@Controller('/member/accounts')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class AccountMemberController {
    constructor(private accountMemberService: AccountMemberService) {}

    @Post('/signup')
    @ApiOperation({
        summary: 'Member Signup',
        description: 'This endpoint to member signup normally.',
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User signed up successfully', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Username has been used', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Recommender username not found', type: BaseResponse })
    async signup(@Body() request: MemberAccountSignupRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.signup(request));
    }

    @Post('/signup-sns')
    @ApiOperation({
        summary: 'Member Signup',
        description: 'This endpoint to member signup normally.',
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'User signed up successfully', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Username has been used', type: BaseResponse })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Recommender username not found', type: BaseResponse })
    async signupSns(@Body() request: MemberAccountSignupSnsRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.signupSns(request));
    }

    @Get('/:username/check')
    @ApiOperation({
        summary: 'Member check',
        description: 'This endpoint to member check username.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Member username checked', type: Boolean })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Missing the parameter', type: BaseResponse })
    async accountMemberCheck(
        @Param('username') username: string,
    ): Promise<BaseResponse<AccountMemberCheckUsernameExistenceResponse>> {
        return BaseResponse.of(await this.accountMemberService.accountMemberCheck(username));
    }

    @Get('/recommender/:username/check')
    @ApiOperation({
        summary: 'Member check',
        description: 'This endpoint to member signup normally.',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Recommender username checked', type: Boolean })
    @ApiResponse({ status: HttpStatus.UNPROCESSABLE_ENTITY, description: 'Missing the parameter', type: BaseResponse })
    async accountRecommenderCheck(
        @Param('username') username: string,
    ): Promise<BaseResponse<AccountMemberCheckUsernameExistenceResponse>> {
        return BaseResponse.of(await this.accountMemberService.accountRecommenderCheck(username));
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Put('/bank-account')
    @ApiOperation({
        summary: 'Upsert bank account',
        description: 'This endpoint upsert bank account in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async upsertBankAccount(@Req() request: any, @Body() bankAccount: UpsertBankAccountRequest): Promise<BaseResponse<null>> {
        await this.accountMemberService.upsertBankAccount(request.user.accountId, bankAccount);
        return BaseResponse.ok();
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
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
        await this.accountMemberService.upsertHSTCertificate(request.user.accountId, hstCertificate);
        return BaseResponse.ok();
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
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
        await this.accountMemberService.upsertForeignWorker(request.user.accountId, foreigWworker);
        return BaseResponse.ok();
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Put('/disability')
    @ApiOperation({
        summary: 'Upsert disability detail',
        description: 'This endpoint upsert disability in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async upsertDisability(@Req() request: any, @Body() disability: UpsertDisabilityRequest): Promise<void> {
        await this.accountMemberService.upsertDisability(request.user.accountId, disability);
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Get()
    @ApiOperation({
        summary: 'Find member detail',
        description: 'This endpoint retrieves member details in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: MemberDetailResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getMemberDetails(@Req() request: any): Promise<BaseResponse<MemberDetailResponse>> {
        return BaseResponse.of(await this.accountMemberService.getDetail(request.user.accountId));
    }
}
