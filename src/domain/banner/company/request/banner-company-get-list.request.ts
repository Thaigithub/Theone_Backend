import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { BannerCompanyBannerType } from '../enum/banner-company-banner-type.enum';

export class BannerCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(BannerCompanyBannerType)
    @IsOptional()
    type: BannerCompanyBannerType;

    @Expose()
    @IsDateString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsDateString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
