import { Expose } from 'class-transformer';
import { IsString, Matches, MaxLength } from 'class-validator';
import { Banner } from '../dto/banner-admin-banner.dto';

class GeneralBanner {
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
    startDate: string;

    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    endDate: string;
}

export class AdminBannerCreateGeneralRequest extends Banner {
    @Expose()
    generalBanner: GeneralBanner;
}
