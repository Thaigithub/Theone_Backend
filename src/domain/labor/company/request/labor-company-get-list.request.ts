import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { LaborType } from '../enum/labor-company-labor-type.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class LaborCompanyGetListRequest extends PaginationRequest {
    @IsOptional()
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public startDate: string;

    @IsOptional()
    @Expose()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    public endDate: string;

    @IsOptional()
    @Expose()
    @IsEnum(LaborType)
    public type: LaborType;

    @IsOptional()
    @Expose()
    @IsString()
    public keyword: string;
}
