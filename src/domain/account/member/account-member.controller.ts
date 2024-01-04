import { Body, Controller, Get, Param, Patch, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { AccountIdExtensionRequest } from 'utils/generics/base.request';
import { BaseResponse } from 'utils/generics/base.response';
import { AccountMemberService } from './account-member.service';
import { AccountMemberSignupSnsRequest } from './request/account-member-signup-sns.request';
import { AccountMemberSignupRequest } from './request/account-member-signup.request';
import { AccountMemberUpdateRequest } from './request/account-member-update.request';
import { AccountMemberUpsertBankAccountRequest } from './request/account-member-upsert-bankaccount.request';
import { AccountMemberUpsertDisabilityRequest } from './request/account-member-upsert-disability.request';
import { AccountMemberUpsertForeignWorkerRequest } from './request/account-member-upsert-foreignworker.request';
import { AccountMemberUpsertHSTCertificateRequest } from './request/account-member-upsert-hstcertificate.request';
import { AccountMemberCheckExistedResponse } from './response/account-member-check-existed.response';
import { AccountMemberGetBankDetailResponse } from './response/account-member-get-bank-detail.response';
import { AccountMemberGetDetailResponse } from './response/account-member-get-detail.response';

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

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Patch()
    async update(
        @Req() request: AccountIdExtensionRequest,
        @Body() body: AccountMemberUpdateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.update(request.user.accountId, body));
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Put('/bank-account')
    async upsertBankAccount(
        @Req() request: AccountIdExtensionRequest,
        @Body() bankAccount: AccountMemberUpsertBankAccountRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.upsertBankAccount(request.user.accountId, bankAccount));
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Get('/bank-account')
    async getBankAccount(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<AccountMemberGetBankDetailResponse>> {
        return BaseResponse.of(await this.accountMemberService.getBankAccount(request.user.accountId));
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Put('/hst-certificate')
    async upsertHSTCertificate(
        @Req() request: AccountIdExtensionRequest,
        @Body() hstCertificate: AccountMemberUpsertHSTCertificateRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.upsertHSTCertificate(request.user.accountId, hstCertificate));
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Put('/foreign-worker')
    async upsertForeignWorker(
        @Req() request: AccountIdExtensionRequest,
        @Body() foreigWworker: AccountMemberUpsertForeignWorkerRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.upsertForeignWorker(request.user.accountId, foreigWworker));
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Put('/disability')
    async upsertDisability(
        @Req() request: AccountIdExtensionRequest,
        @Body() disability: AccountMemberUpsertDisabilityRequest,
    ): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.upsertDisability(request.user.accountId, disability));
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Get()
    async getDetail(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<AccountMemberGetDetailResponse>> {
        return BaseResponse.of(await this.accountMemberService.getDetail(request.user.accountId));
    }

    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @Patch('cancel-membership')
    async cancelMembership(@Req() request: AccountIdExtensionRequest): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.accountMemberService.cancelMembership(request.user.accountId));
    }
}
