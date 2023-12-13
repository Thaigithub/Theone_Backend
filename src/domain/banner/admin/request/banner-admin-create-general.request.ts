import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsString, Matches, MaxLength } from 'class-validator';
import { Banner } from '../dto/banner-admin-banner.dto';

class GeneralBanner {
    @Expose()
    @IsString()
    @ApiProperty({
        required: true,
        description: 'URL link',
        example: 'https://google.com',
    })
    readonly urlLink: string;

    @Expose()
    @IsString()
    @MaxLength(100)
    @ApiProperty({
        required: true,
        description: 'Banner title',
        example: 'This is banner title',
    })
    readonly title: string;

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
    readonly startDate: string;

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
    readonly endDate: string;
}

export class AdminBannerCreateGeneralRequest extends Banner {
    @Expose()
    readonly generalBanner: GeneralBanner;
}
