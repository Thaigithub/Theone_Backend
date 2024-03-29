import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { FileUploadRequest } from 'domain/file/request/file-upload.request';
import { GetSignedUrlResponse } from 'services/storage/response/get-signed-url.response';
import { DomainType, StorageService } from 'services/storage/storage.service';
import { BaseResponse } from 'utils/generics/base.response';

@Controller('/admin/files')
@Roles(AccountType.ADMIN)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
export class FileAdminController {
    constructor(private storageService: StorageService) {}

    @Get('/get-signed-url-to-upload')
    async generateSignedUrlToUploadForAdmin(@Query() query: FileUploadRequest): Promise<BaseResponse<GetSignedUrlResponse>> {
        try {
            return BaseResponse.of(
                await this.storageService.generateSignedUrl(query.contentType, query.fileName, DomainType.ADMIN),
            );
        } catch (exception) {
            return BaseResponse.error(exception);
        }
    }

    @Get('/get-signed-url-to-download')
    async generateSignedUrlToDownloadForAdmin(@Query('key') key: string): Promise<BaseResponse<string>> {
        try {
            return BaseResponse.of(await this.storageService.getSignedUrl(key));
        } catch (exception) {
            return BaseResponse.error(exception);
        }
    }
}
