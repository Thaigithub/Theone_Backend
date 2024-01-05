import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsString, Matches } from 'class-validator';
import { Banner } from '../dto/banner-admin-banner.dto';
import { PostBanner } from '../dto/banner-admin-postbanner.dto';

class AdminPostBanner {
    @Expose()
    @IsString()
    @ApiProperty({
        required: true,
        description: 'URL link',
        example: 'https://google.com',
    })
    urlLink: string;
    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        required: true,
        description: 'Start date',
        example: '2023-05-10',
    })
    startDate: string;
    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @ApiProperty({
        required: true,
        description: 'End date',
        example: '2023-05-10',
    })
    endDate: string;
}

class AdPostBanner extends PostBanner {
    @Expose()
    adminPostBannner: AdminPostBanner;
}
export class BannerAdminUpsertJobPostRequest extends Banner {
    @Expose()
    postBanner: AdPostBanner;
}
