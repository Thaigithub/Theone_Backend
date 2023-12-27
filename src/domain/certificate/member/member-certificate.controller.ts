import {
    Body,
    Controller,
    Delete,
    Get,
    HttpStatus,
    Inject,
    Param,
    ParseIntPipe,
    Post,
    Query,
    Request,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiOperation, ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { UpSertMemberCertificateRequest } from 'domain/certificate/member/request/member-certificate.request';
import { GetMemberCertificateResponse } from 'domain/certificate/member/response/member-certificate.response';
import { BaseResponse } from 'utils/generics/base.response';
import { PaginationResponse } from 'utils/generics/pagination.response';
import { CertificateService } from '../certificate.service';

@ApiTags('[MEMBER] Certificate Management')
@Controller('/member/certificates')
@Roles(AccountType.MEMBER)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiBearerAuth()
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class MemberCertificateController {
    constructor(@Inject(CertificateService) private readonly certificateService: CertificateService) {}

    @Post('/save')
    @ApiOperation({
        summary: 'Save a new certificate',
        description: 'This endpoint is provided for use to upload new certificate',
    })
    @ApiResponse({ status: HttpStatus.CREATED, description: 'Create certificate successfully' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found' })
    async saveCertificate(@Body() request: UpSertMemberCertificateRequest, @Request() req): Promise<BaseResponse<void>> {
        return BaseResponse.of(await this.certificateService.saveCertificate(req.user.accountId, request));
    }

    @Get()
    @ApiOperation({
        summary: 'Get all certificates',
        description: 'This endpoint get all certificates that users currently have',
    })
    @ApiResponse({ status: HttpStatus.OK, description: 'Result of certificates' })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Member not found' })
    async getMemberCertificates(
        @Query('page', ParseIntPipe) page: number, // Use @Query for query parameters
        @Query('size', ParseIntPipe) size: number,
        @Request() req,
    ): Promise<BaseResponse<PaginationResponse<GetMemberCertificateResponse>>> {
        const result = await this.certificateService.getPaginatedCertificates({
            accountId: req.user.accountId,
            page: page,
            size: size,
        });
        return BaseResponse.of(result);
    }

    @Get('/:id')
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

    @Delete('/:id')
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
