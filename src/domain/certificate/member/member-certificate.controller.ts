import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Inject,
    Param,
    ParseBoolPipe,
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
import { UpSertMemberCertificateRequest } from 'domain/certificate/member/request/member-certificate.request';
import { GetMemberCertificateResponse } from 'domain/certificate/member/response/member-certificate.response';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationResponse } from 'utils/generics/pageInfo.response';
import { CertificateService } from '../certificate.service';

@ApiTags('[MEMBER] Certificate Management')
@Controller('member/certificates')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberCertificateController {
    constructor(@Inject(CertificateService) private readonly certificateService: CertificateService) {}

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
        console.log(req.user.accountId);
        await this.certificateService.saveCertificate(req.user.accountId, request);
        return BaseResponse.ok();
    }

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
        @Query('isSpecial', ParseBoolPipe) isSpecial: boolean,
        @Request() req,
    ): Promise<BaseResponse<PaginationResponse<GetMemberCertificateResponse>>> {
        const result = await this.certificateService.getPaginatedCertificates({
            memberId: req.user.accountId,
            page: page,
            size: size,
            isSpecial: isSpecial,
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
        const result = await this.certificateService.getCertificateDetails(id);
        return BaseResponse.of(result);
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
        await this.certificateService.deleteCertificate(id);
        return BaseResponse.ok();
    }
}
