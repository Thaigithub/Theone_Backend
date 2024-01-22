import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { InquiryAdminGetListInquirerType } from '../enum/inquiry-admin-get-list-inquirer-type.enum';
import { InquiryAdminGetListInquiryType } from '../enum/inquiry-admin-get-list-inquiry-type.enum';
import { InquiryAdminGetListSearchCategory } from '../enum/inquiry-admin-get-list-search-category.enum';
import { InquiryAdminGetListStatus } from '../enum/inquiry-admin-get-list-status.enum';

export class InquiryAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    startDate: string;

    @Expose()
    @IsDateString()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'Date must be in the format yyyy-mm-dd.',
    })
    @IsOptional()
    endDate: string;

    @Expose()
    @IsEnum(InquiryAdminGetListInquirerType)
    @IsOptional()
    inquirerType: InquiryAdminGetListInquirerType;

    @Expose()
    @IsEnum(InquiryAdminGetListStatus)
    @IsOptional()
    status: InquiryAdminGetListStatus;

    @Expose()
    @IsEnum(InquiryAdminGetListInquiryType)
    @IsOptional()
    inquiryType: InquiryAdminGetListInquiryType;

    @Expose()
    @IsEnum(InquiryAdminGetListSearchCategory)
    @IsOptional()
    searchCategory: InquiryAdminGetListSearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    keyword: string;
}
