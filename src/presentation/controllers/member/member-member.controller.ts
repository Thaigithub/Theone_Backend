import { Controller, Get, Inject, HttpStatus, UseGuards, Req, Body, Put } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberUseCase } from 'application/use-cases/member.use-case';
import { BaseResponse } from 'presentation/responses/base.response';
import { MemberDetailsResponse } from 'presentation/responses/member.response';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import {
  UpsertBankAccountRequest,
  UpsertForeignWorkerRequest,
  UpsertHSTCertificateRequest,
  UpsertDisabilityRequest,
} from 'presentation/requests/member.request';

@ApiTags('[MEMBER] Members Management')
@ApiProduces('application/json')
@ApiConsumes('application/json')
@Controller('member/members')
export class MemberMemberController {
  constructor(@Inject(MemberUseCase) private readonly memberUseCase: MemberUseCase) {}

  @Get('/details')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({
    summary: 'Find member detail',
    description: 'This endpoint retrieves member details in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async getMemberDetails(@Req() request: any): Promise<BaseResponse<MemberDetailsResponse>> {
    return BaseResponse.of(await this.memberUseCase.getMemberDetails(request.user.accountId));
  }

  @Put('bank-account')
  @UseGuards(JWTAuthGuard)
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
  @UseGuards(JWTAuthGuard)
  @ApiOperation({
    summary: 'Upsert Health and Safety Training Certificate',
    description: 'This endpoint upsert health and safety training certificate in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async upsertHSTCertificate(@Req() request: any, @Body() hstCertificate: UpsertHSTCertificateRequest): Promise<BaseResponse<null>> {
    await this.memberUseCase.upsertHSTCertificate(request.user.accountId, hstCertificate);
    return BaseResponse.ok();
  }

  @Put('foreign-worker')
  @UseGuards(JWTAuthGuard)
  @ApiOperation({
    summary: 'Upsert foreign worker detail',
    description: 'This endpoint upsert foreign worker in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async upsertForeignWorker(@Req() request: any, @Body() foreigWworker: UpsertForeignWorkerRequest): Promise<BaseResponse<null>> {
    await this.memberUseCase.upsertForeignWorker(request.user.accountId, foreigWworker);
    return BaseResponse.ok();
  }

  @Put('disability')
  @UseGuards(JWTAuthGuard)
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
