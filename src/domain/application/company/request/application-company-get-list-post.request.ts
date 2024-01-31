import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ApplicationCompanyGetListCategory } from '../enum/application-company-get-list-category.enum';

export class ApplicationCompanyGetListPostRequest extends PaginationRequest {
    @Expose()
    @IsEnum(ApplicationCompanyGetListCategory)
    @IsOptional()
    category: ApplicationCompanyGetListCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    endDate: string;
}
