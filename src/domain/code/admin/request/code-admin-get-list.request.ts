import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { CodeAdminFilter } from '../dto/code-admin-filter.enum';

export class CodeAdminGetListRequest {
    @ApiProperty({
        type: 'enum',
        enum: CodeAdminFilter,
        required: false,
    })
    @Expose()
    @IsEnum(CodeAdminFilter)
    @IsOptional()
    public codeType: CodeAdminFilter;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageSize: number;

    @ApiProperty({
        type: 'number',
        required: false,
    })
    @Expose()
    @IsNumber()
    @IsOptional()
    @Transform(({ value }) => value && parseInt(value))
    public pageNumber: number;
}
