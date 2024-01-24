import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { InquiryCompanyGetListSearchCategory } from '../enum/inquiry-company-get-list-search-category.enum';

export class InquiryCompanyGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(InquiryCompanyGetListSearchCategory)
    @IsOptional()
    searchCategory: InquiryCompanyGetListSearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
