import { ContractStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsDateString, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { SiteAdminSearchCategory } from '../dto/site-admin-category.dto';

export class SiteAdminGetListRequest extends PaginationRequest {
    @Expose()
    @IsEnum(ContractStatus)
    @IsOptional()
    contractStatus: ContractStatus;

    @Expose()
    @IsDateString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    startDate: string;

    @Expose()
    @IsDateString()
    @IsOptional()
    @Matches(/^\d{4}-\d{2}-\d{2}$/, {
        message: 'The property must be in the format yyyy-mm-dd.',
    })
    endDate: string;

    @Expose()
    @IsEnum(SiteAdminSearchCategory)
    @IsOptional()
    category: SiteAdminSearchCategory;

    @Expose()
    @IsString()
    @IsOptional()
    searchKeyword: string;
}
