import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { MatchingAdminGetListCategory } from '../dto/matching-admin-get-list-category.enum';
import { MatchingAdminGetListServiceType } from '../dto/matching-admin-get-list-service-type.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class MatchingAdminGetListRequest extends PaginationRequest {
    @ApiProperty({ type: MatchingAdminGetListServiceType, required: false })
    @Expose()
    @IsEnum(MatchingAdminGetListServiceType)
    @IsOptional()
    public serviceType: MatchingAdminGetListServiceType;

    @ApiProperty({ type: MatchingAdminGetListCategory, required: false })
    @Expose()
    @IsEnum(MatchingAdminGetListCategory)
    @IsOptional()
    public category: MatchingAdminGetListCategory;

    @ApiProperty({ required: false })
    @Expose()
    @IsOptional()
    @IsString()
    public keyword: string;

    @ApiProperty({ required: false })
    @Expose()
    @IsOptional()
    @IsString()
    public startDate: string;

    @ApiProperty({ required: false })
    @Expose()
    @IsOptional()
    @IsString()
    public endDate: string;
}
