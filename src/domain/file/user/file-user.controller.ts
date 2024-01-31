import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { FileUploadRequest } from 'domain/file/request/file-upload.request';
import { GetSignedUrlResponse } from 'services/storage/response/get-signed-url.response';
import { StorageService } from 'services/storage/storage.service';
import { BaseResponse } from 'utils/generics/base.response';

@UseGuards(AuthJwtGuard)
@Controller('/user/files')
export class FileUserController {
    constructor(private storageService: StorageService) {}

    @Get('/generate-permanently-client-public-url-to-upload')
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
    async getPermanentlyClientPublicUrlToDownload(@Query('key') key: string): Promise<BaseResponse<string>> {
        try {
            return BaseResponse.of(await this.storageService.getPermanentlyClientPublicUrl(key));
        } catch (exception) {
            return BaseResponse.error(exception);
        }
    }
}
