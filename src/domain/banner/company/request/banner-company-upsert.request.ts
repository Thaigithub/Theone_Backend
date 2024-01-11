import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmptyObject, IsNumber, IsOptional, IsString, IsUrl, Matches } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

class CompanyPostType {
    @Expose()
    @IsNumber()
    postId: number;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    desiredStartDate: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    desiredEndDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    detail: string;
}

class CompanyAdvertisingType {
    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsUrl()
    urlLink: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    desiredStartDate: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    desiredEndDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    detail: string;
}

export class BannerCompanyUpsertRequest {
    @Expose()
    @IsNotEmptyObject()
    file: FileRequest;

    @Expose()
    @IsOptional()
    companyPostBanner: CompanyPostType;

    @Expose()
    @IsOptional()
    companyAdvertisingBanner: CompanyAdvertisingType;
}
