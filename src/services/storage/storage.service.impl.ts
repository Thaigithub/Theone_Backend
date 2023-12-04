import { Logger } from '@nestjs/common';
import {
    ASSET_S3_BUCKET,
    ASSET_S3_CLIENT_PUBLIC_URL,
    ASSET_S3_URL_EXPIRATION,
    AWS_ACCESS_KEY,
    AWS_REGION,
    AWS_SECRET_ACCESS_KEY,
} from 'app.config';
import { AWSError, S3 } from 'aws-sdk';
import { PromiseResult } from 'aws-sdk/lib/request';
import { GetSignedUrlResponse } from 'services/storage/response/get-signed-url.response';
import { ContentType, DomainType, SignedUrlType, StorageService } from 'services/storage/storage.service';
import { v4 as uuid } from 'uuid';

export class StorageServiceImpl implements StorageService {
    private s3: S3;
    private readonly bucket: string;
    private readonly expiration: number;
    private readonly s3ClientPublicUrl: string;
    private readonly logger = new Logger(StorageServiceImpl.name);

    constructor() {
        this.bucket = ASSET_S3_BUCKET;
        this.expiration = parseInt(ASSET_S3_URL_EXPIRATION);
        this.s3 = new S3({
            credentials: {
                accessKeyId: AWS_ACCESS_KEY,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
            },
            region: AWS_REGION,
            s3ForcePathStyle: true,
            signatureVersion: 'v4',
        });
        this.s3ClientPublicUrl = ASSET_S3_CLIENT_PUBLIC_URL;
    }
    getSizeByKey = async (key: string) => {
        return await this.s3
            .headObject({ Key: key, Bucket: this.bucket })
            .promise()
            .then((metaData) => metaData);
    };

    getMetadataByKey = async (key: string): Promise<PromiseResult<S3.HeadObjectOutput, AWSError>> => {
        return await this.s3
            .headObject({ Key: key, Bucket: this.bucket })
            .promise()
            .then((metadata) => metadata);
    };

    async generateSignedUrl(contentType: ContentType, fileName: string, domain: DomainType): Promise<GetSignedUrlResponse> {
        const key = `${domain}/${uuid()}-${fileName}`;
        const url = await this.s3.getSignedUrlPromise(SignedUrlType.putObject, {
            Bucket: this.bucket,
            Key: key,
            Expires: this.expiration,
            ContentType: contentType,
        });
        return new GetSignedUrlResponse(url, key);
    }

    async getSignedUrl(key: string): Promise<string> {
        return await this.s3.getSignedUrlPromise(SignedUrlType.getObject, {
            Bucket: this.bucket,
            Key: key,
            Expires: this.expiration,
        });
    }

    async generatePermanentlyClientPublicUrl(contentType: ContentType, fileName: string): Promise<GetSignedUrlResponse> {
        const key = `client/${uuid()}-${fileName}`;
        const url = await this.s3.getSignedUrlPromise(SignedUrlType.putObject, {
            Bucket: this.bucket,
            Key: key,
            ContentType: contentType,
        });
        return new GetSignedUrlResponse(url, key);
    }

    async getPermanentlyClientPublicUrl(key: string): Promise<string> {
        return `${this.s3ClientPublicUrl}/${this.bucket}/${key}`;
    }

    extractFileNameViaClientPublicKey = (key: string): string => {
        return key.split('/')[1];
    };
}
