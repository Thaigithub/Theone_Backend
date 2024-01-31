import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { PostCompanyGetListHeadhuntingCategory } from '../enum/post-company-get-list-headhunting-category.enum';

export class PostCompanyGetListHeadhuntingRequest extends PaginationRequest {
    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;

    @Expose()
    @IsEnum(PostCompanyGetListHeadhuntingCategory)
    @IsOptional()
    category: PostCompanyGetListHeadhuntingCategory;

    @Expose()
    @IsString()
    @IsOptional()
    startDate: string;

    @Expose()
    @IsString()
    @IsOptional()
    endDate: string;
}
