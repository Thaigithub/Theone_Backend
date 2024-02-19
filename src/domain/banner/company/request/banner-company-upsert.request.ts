import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmptyObject, IsNumber, IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

class PostType {
    @Expose()
    @IsNumber()
    postId: number;
}

class AdvertisingType {
    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsUrl()
    urlLink: string;
}

export class BannerCompanyUpsertRequestRequest {
    @Expose()
    @IsNotEmptyObject()
    file: FileRequest;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    detail: string;

    @Expose()
    @IsOptional()
    postBanner: PostType;

    @Expose()
    @IsOptional()
    advertisingBanner: AdvertisingType;

    @Expose()
    @IsNumber()
    productPaymentHistoryId: number;
}
