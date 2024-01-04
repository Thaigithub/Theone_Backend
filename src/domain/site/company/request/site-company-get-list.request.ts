import { ApiProperty } from '@nestjs/swagger';
import { SiteStatus } from '@prisma/client';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class SiteCompanyGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'enum',
        enum: SiteStatus,
    })
    @Expose()
    @IsEnum(SiteStatus)
    @IsOptional()
    status: SiteStatus;
}
