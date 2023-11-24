import { Controller, Inject, Get, Query, UseGuards } from '@nestjs/common';
import { AccountType } from '@prisma/client';
import { DomainType, StorageService } from 'application/services/storage.service';
import { JWTAuthGuard } from 'infrastructure/passport/guards/jwt-auth.guard';
import { Roles, RolesGuard } from 'infrastructure/passport/guards/roles.guard';
import { GetSignedUrlResponse } from 'infrastructure/responses/get-signed-url.response';
import { FileUploadRequest } from 'presentation/requests/file-upload.request';
import { BaseResponse } from 'presentation/responses/base.response';

@Controller('files')
export class FileController {
  constructor(@Inject(StorageService) private readonly storageService: StorageService) {}

  @Get('/generate-permanently-client-public-url-to-upload')
  @UseGuards(JWTAuthGuard)
  async generatePermanentlyClientPublicUrlToUpload(@Query() query: FileUploadRequest): Promise<BaseResponse<GetSignedUrlResponse>> {
    try {
      return BaseResponse.of(await this.storageService.generatePermanentlyClientPublicUrl(query.contentType, query.fileName));
    } catch (exception) {
      return BaseResponse.error(exception);
    }
  }

  @Get('/get-permanently-client-public-url-to-download')
  @UseGuards(JWTAuthGuard)
  async getPermanentlyClientPublicUrlToDownload(@Query('key') key: string): Promise<BaseResponse<string>> {
    try {
      return BaseResponse.of(await this.storageService.getPermanentlyClientPublicUrl(key));
    } catch (exception) {
      return BaseResponse.error(exception);
    }
  }

  @Get('/admins/get-signed-url-to-upload')
  @Roles(AccountType.ADMIN)
  @UseGuards(JWTAuthGuard, RolesGuard)
  async generateSignedUrlToUploadForAdmin(@Query() query: FileUploadRequest): Promise<BaseResponse<GetSignedUrlResponse>> {
    try {
      return BaseResponse.of(await this.storageService.generateSignedUrl(query.contentType, query.fileName, DomainType.ADMIN));
    } catch (exception) {
      return BaseResponse.error(exception);
    }
  }

  @Get('/members/get-signed-url-to-upload')
  @Roles(AccountType.MEMBER)
  @UseGuards(JWTAuthGuard, RolesGuard)
  async generateSignedUrlToUploadForMember(@Query() query: FileUploadRequest): Promise<BaseResponse<GetSignedUrlResponse>> {
    try {
      return BaseResponse.of(await this.storageService.generateSignedUrl(query.contentType, query.fileName, DomainType.MEMBER));
    } catch (exception) {
      return BaseResponse.error(exception);
    }
  }

  @Get('/companies/get-signed-url-to-upload')
  @Roles(AccountType.COMPANY)
  @UseGuards(JWTAuthGuard, RolesGuard)
  async generateSignedUrlToUploadForCompany(@Query() query: FileUploadRequest): Promise<BaseResponse<GetSignedUrlResponse>> {
    try {
      return BaseResponse.of(await this.storageService.generateSignedUrl(query.contentType, query.fileName, DomainType.COMPANY));
    } catch (exception) {
      return BaseResponse.error(exception);
    }
  }
}
