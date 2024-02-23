import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { AccountMemberService } from './account-member.service';
import { AccountMemberSendOtpVerifyPhoneRequest } from './request/account-member-send-otp-verify-phone.request';
import { AccountMemberSignupSnsRequest } from './request/account-member-signup-sns.request';
import { AccountMemberSignupRequest } from './request/account-member-signup.request';
import { AccountMemberUpdatePasswordRequest } from './request/account-member-update-password.request';
import { AccountMemberUpdateRequest } from './request/account-member-update.request';
import { AccountMemberUpsertBankAccountRequest } from './request/account-member-upsert-bankaccount.request';
import { AccountMemberUpsertDisabilityRequest } from './request/account-member-upsert-disability.request';
import { AccountMemberUpsertForeignWorkerRequest } from './request/account-member-upsert-foreignworker.request';
import { AccountMemberUpsertHSTCertificateRequest } from './request/account-member-upsert-hstcertificate.request';
import { AccountMemberVerifyOtpVerifyPhoneRequest } from './request/account-member-verify-otp.request';
import { AccountMemberCheckExistedResponse } from './response/account-member-check-existed.response';
import { AccountMemberGetDetailLevelResponse } from './response/account-member-get-detail-level.response';
import { AccountMemberGetDetailResponse } from './response/account-member-get-detail.response';
import { AccountMemberSendOtpVerifyPhoneResponse } from './response/account-member-send-otp-verify-phone.response';
import { AccountMemberUpdatePasswordResponse } from './response/account-member-update-password.response';
import { AccountMemberVerifyOtpVerifyPhoneResponse } from './response/account-member-verify-otp.response';
import { AccountMemberGetDetailBankResponse } from './response/account-member-get-detail-bank.response';

@Controller('/member/accounts')
export class AccountMemberController {
    constructor(private accountMemberService: AccountMemberService) {}

    @Post('/signup')
    async signup(@Body() request: AccountMemberSignupRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.signup(request));
    }

    @Post('/signup-sns')
    async signupSns(@Body() request: AccountMemberSignupSnsRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.signupSns(request));
    }

    @Get('/username/:username/check')
    async accountMemberCheck(@Param('username') username: string): Promise<BaseResponse<AccountMemberCheckExistedResponse>> {
        return BaseResponse.of(await this.accountMemberService.usernameCheck(username));
    }

    @Patch()
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async update(@Req() request: BaseRequest, @Body() body: AccountMemberUpdateRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.update(request.user.accountId, body));
    }

    @Post('/password/phone/otp')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async changePasswordVerifyPhone(
        @Req() request,
        @Body() body: AccountMemberSendOtpVerifyPhoneRequest,
    ): Promise<AccountMemberSendOtpVerifyPhoneResponse> {
        return await this.accountMemberService.sendOtpVerifyPhone(request.ip, request.user.accountId, body);
    }

    @Patch('/password')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async updatePassword(
        @Req() request,
        @Body() body: AccountMemberUpdatePasswordRequest,
    ): Promise<BaseResponse<AccountMemberUpdatePasswordResponse>> {
        return BaseResponse.of(await this.accountMemberService.updatePassword(request.ip, request.user.accountId, body));
    }

    @Post('/phone/otp')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async sendOTPToVerifyPhone(
        @Req() req,
        @Body() body: AccountMemberSendOtpVerifyPhoneRequest,
    ): Promise<BaseResponse<AccountMemberSendOtpVerifyPhoneResponse>> {
        return BaseResponse.of(
            (await this.accountMemberService.sendOtpVerifyPhone(
                req.ip,
                undefined,
                body,
            )) as AccountMemberSendOtpVerifyPhoneResponse,
        );
    }

    @Post('/phone/otp/verification')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async verifyOTPToVerifyPhone(
        @Req() req,
        @Req() request: BaseRequest,
        @Body() body: AccountMemberVerifyOtpVerifyPhoneRequest,
    ): Promise<BaseResponse<AccountMemberVerifyOtpVerifyPhoneResponse>> {
        return BaseResponse.of(await this.accountMemberService.verifyOtpVerifyPhone(req.ip, request.user.accountId, body));
    }

    @Put('/bank-account')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async upsertBankAccount(
        @Req() request: BaseRequest,
        @Body() bankAccount: AccountMemberUpsertBankAccountRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.upsertBankAccount(request.user.accountId, bankAccount));
    }

    @Get('/bank-account')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async getBankAccount(@Req() request: BaseRequest): Promise<BaseResponse<AccountMemberGetDetailBankResponse>> {
        return BaseResponse.of(await this.accountMemberService.getBankAccount(request.user.accountId));
    }

    @Get('/level')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async getLevel(@Req() request: BaseRequest): Promise<BaseResponse<AccountMemberGetDetailLevelResponse>> {
        return BaseResponse.of(await this.accountMemberService.getLevel(request.user.accountId));
    }

    @Put('/hst-certificate')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async upsertHSTCertificate(
        @Req() request: BaseRequest,
        @Body() hstCertificate: AccountMemberUpsertHSTCertificateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.upsertHSTCertificate(request.user.accountId, hstCertificate));
    }

    @Put('/foreign-worker')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async upsertForeignWorker(
        @Req() request: BaseRequest,
        @Body() foreigWworker: AccountMemberUpsertForeignWorkerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.upsertForeignWorker(request.user.accountId, foreigWworker));
    }

    @Put('/disability')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async upsertDisability(
        @Req() request: BaseRequest,
        @Body() disability: AccountMemberUpsertDisabilityRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.upsertDisability(request.user.accountId, disability));
    }

    @Get()
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async getDetail(@Req() request: BaseRequest): Promise<BaseResponse<AccountMemberGetDetailResponse>> {
        return BaseResponse.of(await this.accountMemberService.getDetail(request.user.accountId));
    }

    @Patch('/cancel-membership')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async cancelMembership(@Req() request: BaseRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.cancelMembership(request.user.accountId));
    }
}
