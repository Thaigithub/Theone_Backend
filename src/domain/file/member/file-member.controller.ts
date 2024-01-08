import { Controller, Get, Query } from '@nestjs/common';
import { FileUploadRequest } from 'domain/file/request/file-upload.request';
import { GetSignedUrlResponse } from 'services/storage/response/get-signed-url.response';
import { DomainType, StorageService } from 'services/storage/storage.service';
import { BaseResponse } from 'utils/generics/base.response';

@Controller('/member/files')
export class FileMemberController {
    constructor(private readonly storageService: StorageService) {}

    @Get('/get-signed-url-to-upload')
    async generateSignedUrlToUploadForMember(@Query() query: FileUploadRequest): Promise<BaseResponse<GetSignedUrlResponse>> {
        try {
            return BaseResponse.of(
                await this.storageService.generateSignedUrl(query.contentType, query.fileName, DomainType.MEMBER),
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
