import { AWSError, S3 } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { GetSignedUrlResponse } from 'services/storage/response/get-signed-url.response';

export interface StorageService {
    generateSignedUrl: (contentType: ContentType, fileName: string, domain: DomainType) => Promise<GetSignedUrlResponse>;
    getSignedUrl: (key: string) => Promise<string>;
    generatePermanentlyClientPublicUrl: (contentType: ContentType, filename: string) => Promise<GetSignedUrlResponse>;
    getPermanentlyClientPublicUrl: (key: string) => Promise<string>;
    getSizeByKey: (key: string) => Promise<any>;
    getMetadataByKey: (key: string) => Promise<PromiseResult<S3.HeadObjectOutput, AWSError>>;
    extractFileNameViaClientPublicKey: (key: string) => string;
}

export const StorageService = Symbol('StorageService');

export enum ContentType {
    PDF = 'application/pdf',
    RAR = 'application/vnd.rar',
    ZIP = 'application/zip',
    JPEG = 'image/jpeg',
    PNG = 'image/png',
    CSV = 'text/csv',
    EXCEL = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    WORD = 'application/msword',
}

export const enum SignedUrlType {
    getObject = 'getObject',
    putObject = 'putObject',
}

export const enum DomainType {
    MEMBER = 'member',
    ADMIN = 'admin',
    COMPANY = 'company',
}
