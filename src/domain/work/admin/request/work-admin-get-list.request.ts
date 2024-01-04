import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SitePeriodStatus } from 'utils/enum/site-status.enum';
import { WorkAdminGetListCategory } from '../dto/work-admin-get-list-category.enum';
import { WorkAdminGetListSort } from '../dto/work-admin-get-list-sort.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class WorkAdminGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'enum',
        enum: WorkAdminGetListCategory,
        required: false,
    })
    @Expose()
    @IsEnum(WorkAdminGetListCategory)
    @IsOptional()
    public category: WorkAdminGetListCategory;

    @ApiProperty({
        type: 'string',
        required: false,
    })
    @Expose()
    @IsString()
    @IsOptional()
    public keyword: string;

    @ApiProperty({
        type: 'enum',
        enum: WorkAdminGetListSort,
        required: false,
    })
    @Expose()
    @IsEnum(WorkAdminGetListSort)
    @IsOptional()
    public numberOfWorkers: WorkAdminGetListSort;

    @ApiProperty({
        type: 'enum',
        enum: SitePeriodStatus,
        required: false,
    })
    @Expose()
    @IsEnum(SitePeriodStatus)
    @IsOptional()
    public siteStatus: SitePeriodStatus;
}
