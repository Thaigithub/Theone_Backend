import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { SitePeriodStatus } from 'utils/enum/site-status.enum';
import { PaginationResponse } from 'utils/generics/pagination.response';

export class WorkAdminGetItemResponse {
    @ApiProperty({ example: 'companyName' })
    companyName: string;

    @ApiProperty({ example: 'siteName' })
    siteName: string;

    @ApiProperty({ example: 20 })
    numberOfWorkers: number;

    @ApiProperty({ example: SitePeriodStatus.PROCEEDING })
    @IsEnum(SitePeriodStatus)
    status: SitePeriodStatus;
}

export class WorkAdminGetListResponse extends PaginationResponse<WorkAdminGetItemResponse> {}
