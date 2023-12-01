import { Controller, Get, HttpCode, HttpStatus, Inject, Param, ParseIntPipe, Query, Request, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { CertificateUseCase } from 'application/use-cases/certificate.use-case';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { Roles, RolesGuard } from 'infrastructure/passport/guards/roles.guard';
import { BaseResponse } from 'presentation/responses/base.response';
import { PaginationResponse } from 'presentation/responses/pageInfo.response';
import { GetMemberCertificateResponse } from 'presentation/responses/member-certificate.response';

@ApiTags('[Member] Certificate')
@Controller('member/certificates')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberCertificateController {
  constructor(@Inject(CertificateUseCase) private readonly userCertificateUseCase: CertificateUseCase) {}

  @Get('get-member-certificates')
  @HttpCode(200)
  @Roles(AccountType.MEMBER)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get all certificates',
    description: 'This endpoint get all certificates that users currently have',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Result of certificates' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Get certificates failed' })
  async getMemberCertificates(
    @Query('page', ParseIntPipe) page: number, // Use @Query for query parameters
    @Query('size', ParseIntPipe) size: number,
    @Request() req,
  ): Promise<BaseResponse<PaginationResponse<GetMemberCertificateResponse>>> {
    const result = await this.userCertificateUseCase.getPaginatedCertificates({
      memberId: req.user.accountId,
      page: page,
      size: size,
    });
    return BaseResponse.of(result);
  }

  @Get(':id')
  @HttpCode(200)
  @Roles(AccountType.MEMBER)
  @UseGuards(JWTAuthGuard, RolesGuard)
  @ApiOperation({
    summary: 'Get certificate details',
    description: 'This endpoint get certificate details',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Details of certificate' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Get certificate details failed' })
  async getCertificateDetails(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<GetMemberCertificateResponse>> {
    const result = await this.userCertificateUseCase.getCertificateDetails(id);
    return BaseResponse.of(result);
  }
}
