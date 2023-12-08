import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { PostCompanyPostStatusFilter, PostCompanyPostTypeFilter } from '../dto/post-company-filter';

export class PostCompanyGetListRequest {
    @Expose()
    @IsString()
    @IsOptional()
    public name: string;

    @Expose()
    @IsEnum(PostCompanyPostTypeFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostCompanyPostTypeFilter,
    })
    public type: PostCompanyPostTypeFilter;

    @Expose()
    @IsEnum(PostCompanyPostStatusFilter)
    @IsOptional()
    @ApiProperty({
        type: 'enum',
        enum: PostCompanyPostStatusFilter,
    })
    public status: PostCompanyPostStatusFilter;

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
