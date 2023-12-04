import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { CertificateUseCase } from 'domain/certification/certificate.usecase';
import { UpSertMemberCertificateRequest } from 'domain/certification/request/member-certificate.request';
import { GetMemberCertificateResponse } from 'domain/certification/response/member-certificate.response';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationResponse } from 'utils/generics/pageInfo.response';

@ApiTags('[Member] Certificate')
@Controller('member/certificates')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberCertificateController {
    constructor(@Inject(CertificateUseCase) private readonly userCertificateUseCase: CertificateUseCase) {}

    @Get('get-member-certificates')
    @HttpCode(200)
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
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
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
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

    @Post('save')
    @HttpCode(200)
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Save a new certificate',
        description: 'This endpoint is provided for use to upload new certificate',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Create certificate successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Create certificate  failed' })
    async saveCertificate(@Body() request: UpSertMemberCertificateRequest, @Request() req): Promise<BaseResponse<void>> {
        await this.userCertificateUseCase.saveCertificate(req.user.accountId, request);
        return BaseResponse.ok();
    }

    @Delete('delete/:id')
    @HttpCode(200)
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    @ApiOperation({
        summary: 'Delete a certificate',
        description: 'This endpoint is provided for use to delete certificate',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Delete certificate successfully' })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Delete certificate failed' })
    async deleteCertificate(@Param('id', ParseIntPipe) id: number): Promise<BaseResponse<void>> {
        await this.userCertificateUseCase.deleteCertificate(id);
        return BaseResponse.ok();
    }
}
