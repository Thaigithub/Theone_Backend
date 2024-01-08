import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';
import { MatchingAdminGetListCategory } from '../dto/matching-admin-get-list-category.enum';
import { MatchingAdminGetListServiceType } from '../dto/matching-admin-get-list-service-type.enum';

export class MatchingAdminGetListRequest extends PaginationRequest {
    @ApiProperty({ type: MatchingAdminGetListServiceType, required: false })
    @Expose()
    @IsEnum(MatchingAdminGetListServiceType)
    @IsOptional()
    serviceType: MatchingAdminGetListServiceType;

    @ApiProperty({ type: MatchingAdminGetListCategory, required: false })
    @Expose()
    @IsEnum(MatchingAdminGetListCategory)
    @IsOptional()
    category: MatchingAdminGetListCategory;

    @ApiProperty({ required: false })
    @Expose()
    @IsOptional()
    @IsString()
    keyword: string;

    @ApiProperty({ required: false })
    @Expose()
    @IsOptional()
    @IsString()
    startDate: string;

    @ApiProperty({ required: false })
    @Expose()
    @IsOptional()
    @IsString()
    endDate: string;
}
