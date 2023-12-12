import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AccountType } from '@prisma/client';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { AuthRoleGuard, Roles } from 'domain/auth/auth-role.guard';
import { FileUploadRequest } from 'domain/file/file-upload.request';
import { GetSignedUrlResponse } from 'services/storage/response/get-signed-url.response';
import { DomainType, StorageService } from 'services/storage/storage.service';
import { BaseResponse } from 'utils/generics/base.response';

@ApiTags('[COMPANY] File Management')
@Roles(AccountType.COMPANY)
@UseGuards(AuthJwtGuard, AuthRoleGuard)
@ApiProduces('application/json')
@ApiConsumes('application/json')
@Controller('/company/files')
export class FileCompanyController {
    constructor(private readonly storageService: StorageService) {}

    @Get('/get-signed-url-to-upload')
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
