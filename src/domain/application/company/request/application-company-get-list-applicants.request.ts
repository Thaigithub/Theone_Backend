import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { ApplicationCompanyApplicantsSearch } from '../enum/application-company-applicants-search.enum';

export class ApplicationCompanyGetListApplicantsRequest extends PaginationRequest {
    @Expose()
    @IsEnum(ApplicationCompanyApplicantsSearch)
    @IsOptional()
    category: ApplicationCompanyApplicantsSearch;

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
