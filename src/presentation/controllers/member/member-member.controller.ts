import { Controller, Get, Inject, HttpStatus, UseGuards, Req, Body, Put } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MemberUseCase } from 'application/use-cases/member.use-case';
import { BaseResponse } from 'presentation/responses/base.response';
import { MemberDetailsResponse } from 'presentation/responses/member.response';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { UpsertBankAccountRequest } from 'presentation/requests/member.request';

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
    summary: 'Find company detail',
    description: 'This endpoint create bank account in the system.',
  })
  @ApiResponse({ status: HttpStatus.OK, type: BaseResponse })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: BaseResponse })
  async upsertBankAccount(@Req() request: any, @Body() bankAccount: UpsertBankAccountRequest): Promise<void> {
    await this.memberUseCase.upsertBankAccount(request.user.accountId, bankAccount);
  }
}
