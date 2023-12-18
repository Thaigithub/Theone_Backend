import { Body, Controller, Get, HttpStatus, Put, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { BaseResponse } from 'utils/generics/base.response';
import { MemberMemberService } from './member-member.service';
import {
    UpsertBankAccountRequest,
    UpsertDisabilityRequest,
    UpsertForeignWorkerRequest,
    UpsertHSTCertificateRequest,
} from './request/member-member.request';
import { MemberDetailResponse } from './response/member-member-get-detail.response';

@ApiTags('[MEMBER] Member Management')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@Controller('member/members')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberMemberController {
    constructor(private readonly memberMemberService: MemberMemberService) {}

    @Get('/details')
    @ApiOperation({
        summary: 'Find member detail',
        description: 'This endpoint retrieves member details in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: MemberDetailResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getMemberDetails(@Req() request: any): Promise<BaseResponse<MemberDetailResponse>> {
        return BaseResponse.of(await this.memberMemberService.getDetail(request.user.accountId));
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
}
