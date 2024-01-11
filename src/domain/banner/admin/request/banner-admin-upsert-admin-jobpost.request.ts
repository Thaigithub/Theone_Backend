import { Expose } from 'class-transformer';
import { IsDateString, IsNotEmptyObject, IsNumber, IsString, Matches } from 'class-validator';
import { Banner } from '../dto/banner-admin-banner.dto';

class AdminPostBanner {
    @Expose()
    @IsString()
    urlLink: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsString()
    title: string;

    @Expose()
    @IsNumber()
    postId: number;
}
export class BannerAdminUpsertAdminJobPostRequest extends Banner {
    @Expose()
    @IsNotEmptyObject()
    adminPostBanner: AdminPostBanner;
}
