import { BannerStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, Matches } from 'class-validator';
import { FileRequest } from 'utils/generics/file.request';

export class BannerRequest {
    @Expose()
    file: FileRequest;

    @Expose()
    @IsEnum(BannerStatus)
    status: BannerStatus;

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
}
