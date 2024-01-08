import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class WorkAdminGetDetailListHistoryRequest extends PaginationRequest {
    @ApiProperty({
        example: '2023-12',
    })
    @Expose()
    @IsString()
    @IsOptional()
    date: string;
}
