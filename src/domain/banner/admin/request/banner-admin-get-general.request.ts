import { Expose } from 'class-transformer';
import { IsOptional, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class BannerAdminGetGeneralRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public startDate: string;

    @Expose()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public endDate: string;
}
