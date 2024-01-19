import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
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
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    endDate: string;
}
