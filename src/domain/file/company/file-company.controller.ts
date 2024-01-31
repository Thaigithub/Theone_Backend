import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { FileUploadRequest } from 'domain/file/request/file-upload.request';
import { GetSignedUrlResponse } from 'services/storage/response/get-signed-url.response';
import { DomainType, StorageService } from 'services/storage/storage.service';
import { BaseResponse } from 'utils/generics/base.response';

@Controller('/company/files')
export class FileCompanyController {
    constructor(private storageService: StorageService) {}

    @Get('/get-signed-url-to-upload')
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

    @Get('/get-signed-url-to-download')
    @Roles(AccountType.COMPANY)
    @UseGuards(AuthJwtGuard, AuthRoleGuard)
    async generateSignedUrlToDownloadForAdmin(@Query('key') key: string): Promise<BaseResponse<string>> {
        try {
            return BaseResponse.of(await this.storageService.getSignedUrl(key));
        } catch (exception) {
            return BaseResponse.error(exception);
        }
    }

    @Get('/get-signed-url-to-upload-no-login')
    async generateSignedUrlToUploadForCompanyNoLogin(
        @Query() query: FileUploadRequest,
    ): Promise<BaseResponse<GetSignedUrlResponse>> {
        try {
            return BaseResponse.of(
                await this.storageService.generateSignedUrl(query.contentType, query.fileName, DomainType.COMPANY),
            );
        } catch (exception) {
            return BaseResponse.error(exception);
        }
    }
}
