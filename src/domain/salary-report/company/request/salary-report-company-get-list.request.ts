import { Expose } from 'class-transformer';
import { IsDateString, IsOptional, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class SalaryReportCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsOptional()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    requestDate: string;
}
