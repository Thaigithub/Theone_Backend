import { Body, Controller, Get, HttpStatus, Inject, Put, Req, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { MemberUseCase } from 'domain/member/member.usecase';
import {
    UpsertBankAccountRequest,
    UpsertDisabilityRequest,
    UpsertForeignWorkerRequest,
    UpsertHSTCertificateRequest,
} from 'domain/member/request/member.request';
import { MemberDetailsResponse } from 'domain/member/response/member.response';
import { BaseResponse } from 'utils/generics/base.response';

@ApiTags('[MEMBER] Members Management')
@ApiProduces('application/json')
@ApiConsumes('application/json')
@Controller('member/members')
export class MemberMemberController {
    constructor(@Inject(MemberUseCase) private readonly memberUseCase: MemberUseCase) {}

    @Get('/details')
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Find member detail',
        description: 'This endpoint retrieves member details in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async getMemberDetails(@Req() request: any): Promise<BaseResponse<MemberDetailsResponse>> {
        console.log(request.user);
        return BaseResponse.of(await this.memberUseCase.getMemberDetails(request.user.accountId));
    }

    @Put('bank-account')
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Upsert bank account',
        description: 'This endpoint upsert bank account in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async upsertBankAccount(@Req() request: any, @Body() bankAccount: UpsertBankAccountRequest): Promise<BaseResponse<null>> {
        await this.memberUseCase.upsertBankAccount(request.user.accountId, bankAccount);
        return BaseResponse.ok();
    }

    @Put('hst-certificate')
    @UseGuards(AuthJwtGuard)
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
        await this.memberUseCase.upsertHSTCertificate(request.user.accountId, hstCertificate);
        return BaseResponse.ok();
    }

    @Put('foreign-worker')
    @UseGuards(AuthJwtGuard)
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
        await this.memberUseCase.upsertForeignWorker(request.user.accountId, foreigWworker);
        return BaseResponse.ok();
    }

    @Put('disability')
    @UseGuards(AuthJwtGuard)
    @ApiOperation({
        summary: 'Upsert disability detail',
        description: 'This endpoint upsert disability in the system.',
    })
    @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
    async upsertDisability(@Req() request: any, @Body() disability: UpsertDisabilityRequest): Promise<void> {
        await this.memberUseCase.upsertDisability(request.user.accountId, disability);
    }
}
