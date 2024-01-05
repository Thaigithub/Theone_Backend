import { Expose } from 'class-transformer';
import { IsDateString, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class SiteCompanyGetListForContractRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    @IsDateString()
    endDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
