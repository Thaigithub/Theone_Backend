import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PostCompanyHeadhuntingRequestFilter } from '../enum/post-company-headhunting-request-filter.enum';

export class PostCompanyHeadhuntingRequestRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(PostCompanyHeadhuntingRequestFilter)
    @IsOptional()
    category: PostCompanyHeadhuntingRequestFilter;

    @Expose()
    @IsString()
    @IsOptional()
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    endDate: string;
}
