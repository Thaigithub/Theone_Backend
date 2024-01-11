import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmptyObject, IsString, Matches, MaxLength } from 'class-validator';
import { Banner } from '../dto/banner-admin-banner.dto';

class AdminAdvertisingBanner {
    @Expose()
    @IsString()
    urlLink: string;

    @Expose()
    @IsString()
    @MaxLength(100)
    title: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    startDate: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    endDate: string;
}

export class BannerAdminUpsertAdminAdvertisingRequest extends Banner {
    @Expose()
    @IsNotEmptyObject()
    adminAdvertisingBanner: AdminAdvertisingBanner;
}
