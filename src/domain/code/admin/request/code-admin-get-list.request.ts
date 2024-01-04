import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { CodeAdminFilter } from '../dto/code-admin-filter.enum';
import { PaginationRequest } from 'utils/generics/pagination.request';

export class CodeAdminGetListRequest extends PaginationRequest {
    @ApiProperty({
        type: 'enum',
        enum: CodeAdminFilter,
        required: false,
    })
    @Expose()
    @IsEnum(CodeAdminFilter)
    @IsOptional()
    public codeType: CodeAdminFilter;
}
