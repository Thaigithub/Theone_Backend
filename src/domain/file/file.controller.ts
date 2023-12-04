import { Controller, Get, Inject, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { FileUploadRequest } from 'domain/file/file-upload.request';
import { GetSignedUrlResponse } from 'services/storage/response/get-signed-url.response';
import { DomainType, StorageService } from 'services/storage/storage.service';
import { BaseResponse } from 'utils/generics/base.response';

@Controller('files')
export class FileController {
    constructor(@Inject(StorageService) private readonly storageService: StorageService) {}

    @Get('/generate-permanently-client-public-url-to-upload')
    @UseGuards(AuthJwtGuard)
    async generatePermanentlyClientPublicUrlToUpload(
        @Query() query: FileUploadRequest,
    ): Promise<BaseResponse<GetSignedUrlResponse>> {
        try {
            return BaseResponse.of(
                await this.storageService.generatePermanentlyClientPublicUrl(query.contentType, query.fileName),
            );
        } catch (exception) {
            return BaseResponse.error(exception);
        }
    }

    @Get('/get-permanently-client-public-url-to-download')
    @UseGuards(AuthJwtGuard)
    async getPermanentlyClientPublicUrlToDownload(@Query('key') key: string): Promise<BaseResponse<string>> {
        try {
            return BaseResponse.of(await this.storageService.getPermanentlyClientPublicUrl(key));
        } catch (exception) {
            return BaseResponse.error(exception);
        }
    }

    @Get('/admins/get-signed-url-to-upload')
    @Roles(AccountType.ADMIN)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async generateSignedUrlToUploadForAdmin(@Query() query: FileUploadRequest): Promise<BaseResponse<GetSignedUrlResponse>> {
        try {
            return BaseResponse.of(
                await this.storageService.generateSignedUrl(query.contentType, query.fileName, DomainType.ADMIN),
            );
        } catch (exception) {
            return BaseResponse.error(exception);
        }
    }

    @Get('/members/get-signed-url-to-upload')
    @Roles(AccountType.MEMBER)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async generateSignedUrlToUploadForMember(@Query() query: FileUploadRequest): Promise<BaseResponse<GetSignedUrlResponse>> {
        try {
            return BaseResponse.of(
                await this.storageService.generateSignedUrl(query.contentType, query.fileName, DomainType.MEMBER),
            );
        } catch (exception) {
            return BaseResponse.error(exception);
        }
    }

    @Get('/companies/get-signed-url-to-upload')
    @Roles(AccountType.COMPANY)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async generateSignedUrlToUploadForCompany(@Query() query: FileUploadRequest): Promise<BaseResponse<GetSignedUrlResponse>> {
        try {
            return BaseResponse.of(
                await this.storageService.generateSignedUrl(query.contentType, query.fileName, DomainType.COMPANY),
            );
        } catch (exception) {
            return BaseResponse.error(exception);
        }
    }
}
