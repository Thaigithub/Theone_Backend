import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiConsumes, ApiProduces, ApiTags } from '@nestjs/swagger';
import { AuthJwtGuard } from 'domain/auth/auth-jwt.guard';
import { FileUploadRequest } from 'domain/file/file-upload.request';
import { GetSignedUrlResponse } from 'services/storage/response/get-signed-url.response';
import { StorageService } from 'services/storage/storage.service';
import { BaseResponse } from 'utils/generics/base.response';

@ApiTags('[USER] File Management')
@UseGuards(AuthJwtGuard)
@Controller('files')
@ApiProduces('application/json')
@ApiConsumes('application/json')
export class FileUserController {
    constructor(private readonly storageService: StorageService) {}

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
